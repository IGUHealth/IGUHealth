import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { SearchParameterResource } from "@iguhealth/client/lib/url";
import { code } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { isSearchParameterInSingularTable } from "../utilities.js";
import { buildClausesManySQL } from "./db_many_clauses/index.js";
import { singularTableSearch } from "./db_singular_clauses/index.js";

function buildParametersManySQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameters: SearchParameterResource<Version>[],
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

export function splitSingular<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  parameters: SearchParameterResource<Version>[],
): {
  singular: SearchParameterResource<Version>[];
  many: SearchParameterResource<Version>[];
} {
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

export default function buildParametersSQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameters: SearchParameterResource<Version>[],
  columns: s.Column[] = [],
): db.SQLFragment[] {
  const { singular, many } = splitSingular(fhirVersion, parameters);

  const singularSQL = singularTableSearch(ctx, fhirVersion, singular, columns);

  const manySQL = buildParametersManySQL(ctx, fhirVersion, many, columns);

  return [...singularSQL, ...manySQL];
}
