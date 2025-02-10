import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { SearchParameterResource } from "@iguhealth/client/lib/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { getSp1Name } from "../../../../cli/generate/sp1-parameters.js";
import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import { isSearchTableType } from "../../../constants.js";
import dateClauses from "./date.js";
import numberClauses from "./number.js";
import quantityClauses from "./quantity.js";
import stringClauses from "./string.js";
import tokenClauses from "./token.js";
import uriClauses from "./uri.js";

const PARAMETER_CLAUSES: Record<
  string,
  <Version extends FHIR_VERSION>(
    ctx: IGUHealthServerCTX,
    fhirVersion: Version,
    parameter: SearchParameterResource<Version>,
  ) => db.SQLFragment<boolean | null, unknown>
> = {
  token: tokenClauses,
  date: dateClauses,
  uri: uriClauses,
  string: stringClauses,
  number: numberClauses,
  quantity: quantityClauses,
};

export function singularSQLClauses<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameters: SearchParameterResource<Version>[],
): db.SQLFragment<boolean | null, unknown>[] {
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

  return conditions;
}

export function singularTableSearch<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameters: SearchParameterResource<Version>[],
  columns: s.Column[] = [],
) {
  if (parameters.length === 0) return [];
  const searchTable = getSp1Name(fhirVersion);

  const conditions = singularSQLClauses(ctx, fhirVersion, parameters);

  return [
    db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
      SELECT ${columns.length === 0 ? "r_version_id" : db.cols(columns)} 
      FROM ${searchTable}
      WHERE ${db.conditions.and({ tenant: ctx.tenant }, ...conditions)}
      `,
  ];
}
