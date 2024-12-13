import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { splitParameter } from "@iguhealth/client/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";
import { getSp1Column, missingModifier } from "./shared.js";

export default function tokenClauses(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  const columnName = getSp1Column(
    fhirVersion,
    "token",
    parameter.searchParameter.url,
  );

  switch (parameter.modifier) {
    case "missing": {
      return missingModifier(fhirVersion, parameter);
    }
    case "not": {
      return db.conditions.and(
        ...parameter.value.map(
          (value): s.r4b_sp1_idx.Whereable | s.r4_sp1_idx.Whereable => {
            const parts = splitParameter(value.toString(), "|");
            if (parts.length === 1) {
              return {
                [`${columnName}_value`]: db.sql`${db.self} != ${db.param(value.toString())}`,
              };
            }
            if (parts.length === 2) {
              if (parts[0] !== "" && parts[1] !== "") {
                return {
                  [`${columnName}_system`]: db.sql`${db.self} = ${db.param(parts[0])}`,
                  [`${columnName}_value`]: db.sql`${db.self} != ${db.param(parts[1])}`,
                };
              } else if (parts[0] !== "" && parts[1] === "") {
                return {
                  [`${columnName}_system`]: db.sql`${db.self} != ${db.param(parts[0])}`,
                };
              } else if (parts[0] === "" && parts[1] !== "") {
                return {
                  [`${columnName}_value`]: db.sql`${db.self} != ${db.param(parts[1])}`,
                };
              }
            }
            throw new Error(`Invalid token value found '${value}'`);
          },
        ),
      );
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4b_sp1_idx.Whereable | s.r4_sp1_idx.Whereable => {
            const parts = splitParameter(value.toString(), "|");
            if (parts.length === 1) {
              return { [`${columnName}_value`]: value.toString() };
            }
            if (parts.length === 2) {
              if (parts[0] !== "" && parts[1] !== "") {
                return {
                  [`${columnName}_system`]: parts[0],
                  [`${columnName}_value`]: parts[1],
                };
              } else if (parts[0] !== "" && parts[1] === "") {
                return { [`${columnName}_system`]: parts[0] };
              } else if (parts[0] === "" && parts[1] !== "") {
                return { [`${columnName}_value`]: parts[1] };
              }
            }
            throw new Error(`Invalid token value found '${value}'`);
          },
        ),
      );
    }
  }
}
