import { StructureDefinitionSnapshot } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import { StructureDefinition } from "@iguhealth/fhir-types/r4/types";

import { FHIRServerCTX } from "../../../ctx/types.js";
import InlineOperation from "../interface.js";
import { FHIRRequest } from "@iguhealth/client/types";

function generateSnapshot(ctx: FHIRServerCTX, sd: StructureDefinition) {
  if (sd.snapshot) return sd;

  if (!sd.differential)
    throw new OperationError(
      outcomeError(
        "invalid",
        "StructureDefinitionSnapshot requires a differential to generate a snapshot"
      )
    );

  return { ...sd };
}

const StructureDefinitionSnapshotInvoke = InlineOperation(
  StructureDefinitionSnapshot.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    if (!input.definition && !input.url) {
      throw new OperationError(
        outcomeError(
          "invalid",
          "StructureDefinitionSnapshot requires either a definition or url parameter"
        )
      );
    }
    const sd: StructureDefinition | undefined = input.definition
      ? input.definition
      : await ctx.resolveCanonical("StructureDefinition", input.url as string);

    if (!sd) {
      throw new OperationError(
        outcomeError(
          "invalid",
          "StructureDefinitionSnapshot could not find StructureDefinition"
        )
      );
    }

    return sd;
  }
);

export default StructureDefinitionSnapshotInvoke;
