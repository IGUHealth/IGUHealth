import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { SearchParameter } from "@iguhealth/fhir-types/r4/types";

import { FHIRServerCTX } from "../../../../../fhir-context/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";
import * as sqlUtils from "../../../../utilities/sql.js";
import { buildParameterSQL } from "./index.js";
import { missingModifier } from "./shared.js";

/*
 ** This function allows resolution based on canonical references.
 ** Performs a search on the uri table to find the reference_id for the canonical reference.
 */
function generateCanonicalReferenceSearch(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
): db.SQLFragment {
  const where: s.uri_idx.Whereable = {
    tenant: ctx.tenant,
    resource_type: db.sql`${db.self} in (${sqlUtils.paramsWithComma(
      parameter.searchParameter.target || [],
    )})`,
    value: parameter.value[0].toString(),
  };

  return db.sql<s.uri_idx.SQL>`
    ( SELECT DISTINCT ON (${"r_id"}) ${"r_id"} FROM ${"uri_idx"} WHERE ${where} )`;
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

function chainSQL(
  ctx: FHIRServerCTX,
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
      return buildParameterSQL(
        ctx,
        {
          type: "resource",
          name: p.name,
          searchParameter: p,
          modifier: "missing",
          value: ["false"],
        },
        ["r_id", "reference_id"],
      );
    });
    return db.sql`(${db.mapWithSeparator(res, db.sql` UNION `, (c) => c)})`;
  });

  const lastParameters =
    parameter.chainedParameters[parameter.chainedParameters.length - 1];

  const lastResult = db.sql`(${db.mapWithSeparator(
    lastParameters.map((p) => {
      return buildParameterSQL(
        ctx,
        { ...parameter, searchParameter: p, chainedParameters: [] },
        ["r_id"],
      );
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

function sqlParameterValue(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  parameterValue: string | number,
) {
  const canonicalSQL = db.sql<s.reference_idx.SQL>`${"reference_id"} in ${generateCanonicalReferenceSearch(
    ctx,
    parameter,
  )}`;

  const referenceValue = parameterValue.toString();
  const parts = referenceValue.split("/");

  if (parts.length === 1) {
    const where: s.reference_idx.Whereable = {
      reference_id: parts[0],
    };
    return db.conditions.or(
      canonicalSQL,
      db.sql<s.reference_idx.SQL>`${where}`,
    );
  } else if (parts.length === 2) {
    const where: s.reference_idx.Whereable = {
      reference_type: parts[0],
      reference_id: parts[1],
    };

    return db.conditions.or(
      canonicalSQL,
      db.sql<s.reference_idx.SQL>`${where}`,
    );
  } else {
    // In this case only perform a canonical search as could have passed a canonical url for the value.
    return canonicalSQL;
  }
}

export default function referenceClauses(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  if (parameter.modifier === "missing") {
    return missingModifier(ctx, parameter);
  }
  if (isChainParameter(parameter)) return chainSQL(ctx, parameter);
  else {
    return db.conditions.or(
      ...parameter.value.map((value) =>
        sqlParameterValue(ctx, parameter, value),
      ),
    );
  }
}
