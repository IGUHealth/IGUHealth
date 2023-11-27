import { StructureDefinitionSnapshot } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import { StructureDefinition } from "@iguhealth/fhir-types/r4/types";

import { FHIRServerCTX } from "../../../ctx/types.js";
import InlineOperation from "../interface.js";
import { FHIRRequest } from "@iguhealth/client/types";

function findLastIndex<T>(collection: T[], predicate: (item: T) => boolean) {
  let index = -1;
  for (let i = 0; i < collection.length; i++) {
    const isPredicate = predicate(collection[i]);
    if (isPredicate) index = i;
    if (!isPredicate && index > -1) break;
  }
  return index;
}

async function generateSnapshot(ctx: FHIRServerCTX, sd: StructureDefinition) {
  if (sd.snapshot) return sd;

  if (!sd.differential)
    throw new OperationError(
      outcomeError(
        "invalid",
        "StructureDefinitionSnapshot requires a differential to generate a snapshot"
      )
    );
  // slice so I'm not altering the original when injecting values with splice.
  const baseSnapshotElements = sd.baseDefinition
    ? (
        (await ctx.resolveCanonical("StructureDefinition", sd.baseDefinition)
          ?.snapshot?.element) ?? []
      ).slice()
    : [];

  for (const element of sd.differential.element) {
    const index = findLastIndex(
      baseSnapshotElements || [],
      (e) => e.path === element.path
    );
    if (!index)
      throw new OperationError(
        outcomeError(
          "invalid",
          `Could not find element ${element.path} in base snapshot`
        )
      );
    baseSnapshotElements.splice(index, 0, element);
  }

  return { ...sd, snapshot: { element: baseSnapshotElements } };
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

    return generateSnapshot(ctx, sd);
  }
);

export default StructureDefinitionSnapshotInvoke;
