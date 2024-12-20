import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { code, SearchParameter, uri } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";
import { missingModifier } from "./shared.js";
import buildParametersSQL from "../index.js";
import { isSearchParameterInSingularTable } from "../../utilities.js";
import { getSp1Name } from "../../../../../cli/generate/sp1-parameters.js";
import { getSp1Column } from "../db_singular_clauses/shared.js";
import { canonicalColumns as r4CanonicalColumns } from "../../../../providers/schemas/generated/sp1-parameters/r4.sp1parameters.js";

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

function getCanonicalColumns(
  fhirVersion: FHIR_VERSION,
  bases: code[],
): (s.r4_sp1_idx.Column | s.r4b_sp1_idx.Column)[] {
  let columns: (s.r4_sp1_idx.Column | s.r4b_sp1_idx.Column)[] = [];
  for (const base of bases) {
    if (Object.keys(r4CanonicalColumns).includes(base)) {
      const canonicalUrls =
        r4CanonicalColumns[base as keyof typeof r4CanonicalColumns];
      columns = columns.concat(
        canonicalUrls.map((c) => getSp1Column(fhirVersion, "uri", c as uri)),
      );
    }
  }

  return columns;
}

function getCanonicalSearchSQL(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment | undefined {
  const base = parameter.searchParameter.target;
  const columns = getCanonicalColumns(fhirVersion, base ?? []);

  if (columns.length === 0) {
    return undefined;
  }

  const conditions = db.conditions.or(
    ...columns.map((column) => ({ [column]: parameter.value[0].toString() })),
  );

  return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
  (SELECT ${"r_id"} FROM ${getSp1Name(fhirVersion)} WHERE ${conditions})`;
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
  const findCanonicalSQL = getCanonicalSearchSQL(ctx, fhirVersion, parameter);
  const checkCanonicalSQL = findCanonicalSQL
    ? db.sql`${"reference_id"} in ${findCanonicalSQL}`
    : db.sql`false`;

  const referenceValue = parameterValue.toString();
  const parts = referenceValue.split("/");

  if (parts.length === 1) {
    const where: s.r4_reference_idx.Whereable = {
      reference_id: parts[0],
    };
    return db.conditions.or(
      checkCanonicalSQL,
      db.sql<s.r4_reference_idx.SQL>`${where}`,
    );
  } else if (parts.length === 2) {
    const where: s.r4_reference_idx.Whereable = {
      reference_type: parts[0],
      reference_id: parts[1],
    };

    return db.conditions.or(
      checkCanonicalSQL,
      db.sql<s.r4_reference_idx.SQL>`${where}`,
    );
  } else {
    // In this case only perform a canonical search as could have passed a canonical url for the value.
    return checkCanonicalSQL;
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
