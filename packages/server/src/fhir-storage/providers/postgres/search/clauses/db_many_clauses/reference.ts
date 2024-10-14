import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { SearchParameter } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../../../../fhir-api/types.js";
import {
  SearchParameterResource,
  searchParameterToTableName,
} from "../../../../../utilities/search/parameters.js";
import * as sqlUtils from "../../../../../utilities/sql.js";
import { missingModifier } from "./shared.js";
import buildParametersSQL from "../index.js";
import { isSearchParameterInSingularTable } from "../../utilities.js";
import { getSp1Name } from "../../../../../../cli/generate/sp1-parameters.js";
import { getSp1Column } from "../db_singular_clauses/shared.js";

/*
 ** This function allows resolution based on canonical references.
 ** Performs a search on the uri table to find the reference_id for the canonical reference.
 */
function canonicalManySQL(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment {
  const where: s.r4_uri_idx.Whereable | s.r4b_uri_idx.Whereable = {
    tenant: ctx.tenant,
    resource_type:
      (parameter.searchParameter.target ?? []).length === 0
        ? db.sql`${db.self} IS NOT NULL`
        : db.sql`${db.self} in (${sqlUtils.paramsWithComma(
            parameter.searchParameter.target ?? [],
          )})`,
    value: parameter.value[0].toString(),
  };

  return db.sql<s.r4_uri_idx.SQL | s.r4b_uri_idx.SQL>`
    ( SELECT DISTINCT ON (${"r_id"}) ${"r_id"} FROM ${searchParameterToTableName(fhirVersion, "uri")} WHERE ${where} )`;
}

function canonicalSP1SQL(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment {
  const column = getSp1Column(
    fhirVersion,
    "uri",
    parameter.searchParameter.url,
  );
  return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
      (SELECT ${"r_id"} FROM ${getSp1Name(fhirVersion)} WHERE ${column} = ${db.param(parameter.value[0])})`;
}

function getCanonicalSearchSQL(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
) {
  if (
    isSearchParameterInSingularTable(fhirVersion, parameter.searchParameter)
  ) {
    return canonicalSP1SQL(ctx, fhirVersion, parameter);
  } else {
    return canonicalManySQL(ctx, fhirVersion, parameter);
  }
}

function isChainParameter(
  parameter: SearchParameterResource,
): parameter is SearchParameterResource & {
  chainedParameters: SearchParameter[][];
} {
  if (parameter.chainedParameters && parameter.chainedParameters.length > 0)
    return true;
  return false;
}

function chainSQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameter: SearchParameterResource & {
    chainedParameters: SearchParameter[][];
  },
): db.SQLFragment<boolean | null, never> {
  const referenceParameters = [
    [parameter.searchParameter],
    ...parameter.chainedParameters.slice(0, -1),
  ];

  const sqlCHAIN = referenceParameters.map((parameters) => {
    const res = parameters.map((p): db.SQLFragment => {
      return buildParametersSQL(
        ctx,
        fhirVersion,
        [
          {
            type: "resource",
            name: p.name,
            searchParameter: p,
            modifier: "missing",
            value: ["false"],
          },
        ],
        ["r_id", "reference_id"],
      )[0];
    });
    return db.sql`(${db.mapWithSeparator(res, db.sql` UNION `, (c) => c)})`;
  });

  const lastParameters =
    parameter.chainedParameters[parameter.chainedParameters.length - 1];

  const lastResult = db.sql`(${db.mapWithSeparator(
    lastParameters.map((p) => {
      return buildParametersSQL(
        ctx,
        fhirVersion,
        [{ ...parameter, searchParameter: p }],
        ["r_id"],
      )[0];
    }),
    db.sql` UNION `,
    (c) => c,
  )})`;

  const referencesSQL = [...sqlCHAIN, lastResult]
    // Reverse as we want to start from initial value and then chain up to the last reference ID.
    .reverse()
    .reduce(
      (
        previousResult: db.SQLFragment,
        query: db.SQLFragment,
        index: number,
      ) => {
        const queryAlias = db.raw(`query${index}`);
        // Previous result should include the list of ids for next reference_id.
        // Starting at the value this would be r_id
        return db.sql`(select ${"r_id"} from ${query} as ${queryAlias} WHERE ${queryAlias}.${"reference_id"} in ${previousResult})`;
      },
    );

  return db.sql`${"r_id"} in (select ${"r_id"} from ${referencesSQL} as referencechain)`;
}

function sqlParameterValue<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameter: SearchParameterResource,
  parameterValue: string | number,
) {
  const canonicalSQL = db.sql<s.r4_reference_idx.SQL>`${"reference_id"} in ${getCanonicalSearchSQL(
    ctx,
    fhirVersion,
    parameter,
  )}`;

  const referenceValue = parameterValue.toString();
  const parts = referenceValue.split("/");

  if (parts.length === 1) {
    const where: s.r4_reference_idx.Whereable = {
      reference_id: parts[0],
    };
    return db.conditions.or(
      canonicalSQL,
      db.sql<s.r4_reference_idx.SQL>`${where}`,
    );
  } else if (parts.length === 2) {
    const where: s.r4_reference_idx.Whereable = {
      reference_type: parts[0],
      reference_id: parts[1],
    };

    return db.conditions.or(
      canonicalSQL,
      db.sql<s.r4_reference_idx.SQL>`${where}`,
    );
  } else {
    // In this case only perform a canonical search as could have passed a canonical url for the value.
    return canonicalSQL;
  }
}

export default function referenceClauses<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  switch (parameter.modifier) {
    case "missing": {
      return missingModifier(ctx, parameter);
    }
    default: {
      if (isChainParameter(parameter))
        return chainSQL(ctx, fhirVersion, parameter);
      else {
        return db.conditions.or(
          ...parameter.value.map((value) =>
            sqlParameterValue(ctx, fhirVersion, parameter, value),
          ),
        );
      }
    }
  }
}
