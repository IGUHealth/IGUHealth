import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { FHIRServerCTX } from "../../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";

export default function stringClauses(
  _ctx: FHIRServerCTX,
  _fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, never> {
  switch (parameter.modifier) {
    case "exact": {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4_string_idx.Whereable => ({ value: value.toString() }),
        ),
      );
    }
    case "contains": {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4_string_idx.Whereable => ({
            value: db.sql`${db.self} ilike ${db.param(`%${value}%`)}`,
          }),
        ),
      );
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4_string_idx.Whereable => ({
            value: db.sql`${db.self} ilike ${db.param(`${value}%`)}`,
          }),
        ),
      );
    }
  }
}
