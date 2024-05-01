import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { splitParameter } from "@iguhealth/client/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { FHIRServerCTX } from "../../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";
import { missingModifier } from "./shared.js";

export default function tokenClauses(
  ctx: FHIRServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  switch (parameter.modifier) {
    case "missing":
      return missingModifier(ctx, parameter);
    default: {
      return db.conditions.or(
        ...parameter.value.map((value): s.r4_token_idx.Whereable => {
          const parts = splitParameter(value.toString(), "|");
          if (parts.length === 1) {
            return { value: value.toString() };
          }
          if (parts.length === 2) {
            if (parts[0] !== "" && parts[1] !== "") {
              return { system: parts[0], value: parts[1] };
            } else if (parts[0] !== "" && parts[1] === "") {
              return { system: parts[0] };
            } else if (parts[0] === "" && parts[1] !== "") {
              return { value: parts[1] };
            }
          }
          throw new Error(`Invalid token value found '${value}'`);
        }),
      );
    }
  }
}
