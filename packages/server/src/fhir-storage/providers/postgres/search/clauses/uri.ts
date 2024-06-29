import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";
import { missingModifier } from "./shared.js";

export default function uriClauses(
  _ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  switch (parameter.modifier) {
    case "missing": {
      return missingModifier(_ctx, parameter);
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4_uri_idx.Whereable => ({ value: value.toString() }),
        ),
      );
    }
  }
}
