import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { SearchParameterResource } from "@iguhealth/client/lib/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import { getSp1Column, missingModifier } from "./shared.js";

export default function uriClauses<Version extends FHIR_VERSION>(
  _ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameter: SearchParameterResource<Version>,
): db.SQLFragment<boolean | null, unknown> {
  const columnName = getSp1Column(
    fhirVersion,
    "uri",
    parameter.searchParameter.url,
  );

  switch (parameter.modifier) {
    case "missing": {
      return missingModifier(fhirVersion, parameter);
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.r4b_sp1_idx.Whereable | s.r4_sp1_idx.Whereable => ({
            [columnName]: value.toString(),
          }),
        ),
      );
    }
  }
}
