import { AllInteractions, FHIRRequest } from "@iguhealth/client/types";
import { StructureDefinition, canonical } from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { StructureDefinitionSnapshot } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import InlineOperation from "../interface.js";

function findLastIndex<T>(collection: T[], predicate: (item: T) => boolean) {
  let index = -1;
  for (let i = 0; i < collection.length; i++) {
    const isPredicate = predicate(collection[i]);
    if (isPredicate) index = i;
  }
  return index;
}

async function generateSnapshot(
  fhirVersion: FHIR_VERSION,
  ctx: IGUHealthServerCTX,
  sd: StructureDefinition | r4b.StructureDefinition,
): Promise<StructureDefinition> {
  sd.snapshot = { element: [] };

  if (!sd.differential)
    throw new OperationError(
      outcomeError(
        "invalid",
        "StructureDefinitionSnapshot requires a differential to generate a snapshot",
      ),
    );
  // slice so I'm not altering the original when injecting values with splice.
  const baseSnapshotElements = sd.baseDefinition
    ? (
        (
          await ctx.resolveCanonical(ctx, fhirVersion, "StructureDefinition", [
            sd.baseDefinition,
          ])
        )[0]?.snapshot?.element ?? []
      ).slice()
    : [];

  for (const element of sd.differential.element) {
    const existingElementIndex = findLastIndex(
      baseSnapshotElements,
      (e) => e.id === element.id,
    );

    if (existingElementIndex !== -1) {
      baseSnapshotElements.splice(existingElementIndex, 1, {
        ...baseSnapshotElements[existingElementIndex],
        ...element,
      });
    } else {
      const index = findLastIndex(baseSnapshotElements, (e) =>
        element.path.startsWith(e.path),
      );

      if (index === -1)
        throw new OperationError(
          outcomeError(
            "invalid",
            `Could not find element with path '${element.path}' in base snapshot`,
          ),
        );

      // Place behind last element found.
      baseSnapshotElements.splice(index + 1, 0, element);
    }
  }

  return {
    ...sd,
    snapshot: { element: baseSnapshotElements },
  } as StructureDefinition;
}

export const StructureDefinitionSnapshotInvoke = InlineOperation(
  StructureDefinitionSnapshot.Op,
  async (
    ctx: IGUHealthServerCTX,
    request: FHIRRequest<FHIR_VERSION, AllInteractions>,
    input,
  ) => {
    if (!input.definition && !input.url) {
      throw new OperationError(
        outcomeError(
          "invalid",
          "StructureDefinitionSnapshot requires either a definition or url parameter",
        ),
      );
    }

    const sd: StructureDefinition | r4b.StructureDefinition | undefined =
      input.definition
        ? input.definition
        : (
            await ctx.resolveCanonical(
              ctx,
              request.fhirVersion,
              "StructureDefinition",
              [input.url as canonical],
            )
          )[0];

    if (!sd) {
      throw new OperationError(
        outcomeError(
          "invalid",
          "StructureDefinitionSnapshot could not find StructureDefinition",
        ),
      );
    }

    return generateSnapshot(request.fhirVersion, ctx, sd);
  },
);
