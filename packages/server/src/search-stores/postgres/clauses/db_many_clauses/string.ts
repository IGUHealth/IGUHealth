import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { SearchParameterResource } from "@iguhealth/client/lib/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import { missingModifier } from "./shared.js";

export default function stringClauses<Version extends FHIR_VERSION>(
  _ctx: IGUHealthServerCTX,
  _fhirVersion: Version,
  parameter: SearchParameterResource<Version>,
): db.SQLFragment<boolean | null, unknown> {
  switch (parameter.modifier) {
    case "missing":
      return missingModifier(_ctx, parameter);
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
