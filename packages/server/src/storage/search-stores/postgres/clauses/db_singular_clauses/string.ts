import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../../../fhir-server/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";
import { getSp1Column, missingModifier } from "./shared.js";

export default function stringClauses(
  _ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  const columnName = getSp1Column(
    fhirVersion,
    "string",
    parameter.searchParameter.url,
  );

  switch (parameter.modifier) {
    case "missing":
      return missingModifier(fhirVersion, parameter);

    case "exact": {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4b_sp1_idx.Whereable | s.r4_sp1_idx.Whereable => ({
            [columnName]: value.toString(),
          }),
        ),
      );
    }
    case "contains": {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4b_sp1_idx.Whereable | s.r4_sp1_idx.Whereable => ({
            [columnName]: db.sql`${db.self} ilike ${db.param(`%${value}%`)}`,
          }),
        ),
      );
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4b_sp1_idx.Whereable | s.r4_sp1_idx.Whereable => ({
            [columnName]: db.sql`${db.self} ilike ${db.param(`${value}%`)}`,
          }),
        ),
      );
    }
  }
}
