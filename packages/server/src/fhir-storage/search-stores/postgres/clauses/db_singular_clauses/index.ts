import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { getSp1Name } from "../../../../../cli/generate/sp1-parameters.js";
import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import { isSearchTableType } from "../../../../constants.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";
import dateClauses from "./date.js";
import numberClauses from "./number.js";
import quantityClauses from "./quantity.js";
import stringClauses from "./string.js";
import tokenClauses from "./token.js";
import uriClauses from "./uri.js";

const PARAMETER_CLAUSES: Record<
  string,
  (
    ctx: IGUHealthServerCTX,
    fhirVersion: FHIR_VERSION,
    parameter: SearchParameterResource,
  ) => db.SQLFragment<boolean | null, unknown>
> = {
  token: tokenClauses,
  date: dateClauses,
  uri: uriClauses,
  string: stringClauses,
  number: numberClauses,
  quantity: quantityClauses,
};

export function buildClausesSingularSQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameters: SearchParameterResource[],
  columns: s.Column[] = [],
): db.SQLFragment[] {
  if (parameters.length === 0) {
    return [];
  }

  const parameterType = parameters[0].searchParameter.type as string;

  if (!isSearchTableType(parameterType)) {
    throw new OperationError(
      outcomeError(
        "not-supported",
        `Parameter of type '${parameterType}' is not yet supported.`,
      ),
    );
  }

  const searchTable = getSp1Name(fhirVersion);

  const conditions = parameters.map(
    (parameter): db.SQLFragment<boolean | null, unknown> => {
      const searchParameter = parameter.searchParameter;
      return PARAMETER_CLAUSES[searchParameter.type](
        ctx,
        fhirVersion,
        parameter,
      );
    },
  );

  return [
    db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
  SELECT ${columns.length === 0 ? "r_version_id" : db.cols(columns)} 
  FROM ${searchTable}
  WHERE ${db.conditions.and({ tenant: ctx.tenant }, ...conditions)}
  `,
  ];
}
