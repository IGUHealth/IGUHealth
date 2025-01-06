import * as db from "zapatos/db";
import * as s from "zapatos/schema";
import { code } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../utilities/search/parameters.js";
import { buildClausesManySQL } from "./db_many_clauses/index.js";
import { buildClausesSingularSQL } from "./db_singular_clauses/index.js";
import { isSearchParameterInSingularTable } from "../utilities.js";

function buildParametersManySQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameters: SearchParameterResource[],
  columns: s.Column[] = [],
): db.SQLFragment[] {
  const groups = Object.groupBy(parameters, (p) => p.searchParameter.type);

  const res = Object.keys(groups)
    .map((searchType) => {
      return buildClausesManySQL(
        ctx,
        fhirVersion,
        groups[searchType as code] ?? [],
        columns,
      );
    })
    .filter((v): v is db.SQLFragment => v !== undefined);

  return res;
}

function splitSingular(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameters: SearchParameterResource[],
): { singular: SearchParameterResource[]; many: SearchParameterResource[] } {
  const singular = [];
  const many = [];

  for (const parameter of parameters) {
    if (
      isSearchParameterInSingularTable(fhirVersion, parameter.searchParameter)
    ) {
      singular.push(parameter);
    } else {
      many.push(parameter);
    }
  }

  return { singular, many };
}

export default function buildParametersSQL(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameters: SearchParameterResource[],
  columns: s.Column[] = [],
): db.SQLFragment[] {
  const { singular, many } = splitSingular(ctx, fhirVersion, parameters);

  const singularSQL = buildClausesSingularSQL(
    ctx,
    fhirVersion,
    singular,
    columns,
  );

  const manySQL = buildParametersManySQL(ctx, fhirVersion, many, columns);

  return [...singularSQL, ...manySQL];
}
