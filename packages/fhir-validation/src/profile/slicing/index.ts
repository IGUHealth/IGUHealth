/* eslint-disable @typescript-eslint/no-explicit-any */
import { eleIndexToChildIndices } from "@iguhealth/codegen/traversal/structure-definition";
import { Loc, descend, get, pointer } from "@iguhealth/fhir-pointer";
import {
  ElementDefinition,
  OperationOutcome,
  OperationOutcomeIssue,
  StructureDefinition,
  id,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, R4, Resource } from "@iguhealth/fhir-types/versions";
import * as fp from "@iguhealth/fhirpath";
import { metaValue } from "@iguhealth/meta-value/v2";
import {
  OperationError,
  issueError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import {
  conformsToPattern,
  conformsToValue,
} from "../../elements/conformance.js";
import { validateElementSingular } from "../../structural/index.js";
import { ElementLoc, ValidationCTX } from "../../types.js";
import { ascendElementLoc, fieldName } from "../../utilities.js";
import {
  Discriminator,
  convertPathToElementPointer,
  removeTypeOnPath,
} from "../utilities.js";

function isSliced(element: ElementDefinition) {
  return element.slicing !== undefined;
}

type SlicingDescriptor = {
  discriminator: number;
  slices: number[];
};

/**
 * Filter elements for discriminator slice + slicing elements.
 * @param elements
 */
export function getSliceIndices(
  profile: Resource<FHIR_VERSION, "StructureDefinition">,
  elementLoc: ElementLoc,
): SlicingDescriptor[] {
  const { parent: elementsLoc, field: index } = ascendElementLoc(elementLoc);
  const elements = get(elementsLoc, profile as StructureDefinition);
  const children = eleIndexToChildIndices(elements, index as number);

  const slices: SlicingDescriptor[] = [];

  let i = 0;
  while (i < children.length) {
    const childIndex = children[i++];
    if (isSliced(elements[childIndex])) {
      const discriminatorIndex = childIndex;
      const sliceIndexes = [];

      while (i < children.length && elements[children[i]].sliceName) {
        sliceIndexes.push(children[i]);
        i++;
      }
      slices.push({
        discriminator: discriminatorIndex,
        slices: sliceIndexes,
      });
    }
  }

  return slices;
}

/**
 * Returns the elementDefinition associated with the given discriminator. This is used to extract the value the slice is expecting.
 * @param discriminator The discriminator to use to distinguish slices.
 * @param elements The elements to search for the slice value.
 * @param currentIndex The current index to search for the slice value.
 * @returns The index of elementdefinition to use to slice the value for the discriminator.
 */
function findElementDefinitionForSliceDiscriminator(
  discriminatorElementPath: string,
  elements: ElementDefinition[],
  currentIndex: number,
): number | undefined {
  const element = elements[currentIndex];
  const typelessPath = removeTypeOnPath(element.path);

  if (discriminatorElementPath === typelessPath) {
    return currentIndex;
  }

  if (discriminatorElementPath.startsWith(typelessPath)) {
    const childIndexes = eleIndexToChildIndices(elements, currentIndex);
    for (const childIndex of childIndexes) {
      const foundIndex = findElementDefinitionForSliceDiscriminator(
        discriminatorElementPath,
        elements,
        childIndex,
      );
      if (foundIndex) {
        return foundIndex;
      }
    }
  }

  return undefined;
}

async function isConformantToSlicesDiscriminator(
  discriminator: Discriminator,
  sliceValueElementDefinition: ElementDefinition,
  root: object,
  locs: Loc<any, any, any>[],
): Promise<Loc<any, any, any>[]> {
  switch (discriminator.type) {
    case "value": {
      const expectedValue = (
        await fp.evaluate("$this.fixed", sliceValueElementDefinition, {
          type: "ElementDefinition" as uri,
        })
      )[0];
      const conformantLocs: Loc<any, any, any>[] = [];

      for (const loc of locs) {
        const value = get(loc, root);
        const evaluation = await fp.evaluate(discriminator.path, value);
        if (
          evaluation.find((v) => conformsToValue(expectedValue, v)) !==
          undefined
        ) {
          conformantLocs.push(loc);
        }
      }
      return conformantLocs;
    }
    case "exists":
    case "pattern": {
      const pattern = (
        await fp.evaluate(
          "$this.pattern",
          metaValue(
            { type: "ElementDefinition" as uri, fhirVersion: R4 },
            sliceValueElementDefinition,
          ),
        )
      )[0];

      if (!pattern) {
        throw new OperationError(
          outcomeError("not-found", "Could not find a pattern for slice."),
        );
      }

      const conformantLocs: Loc<any, any, any>[] = [];

      for (const loc of locs) {
        const value = get(loc, root);
        const evaluation = await fp.evaluate(discriminator.path, value);

        if (evaluation.find((v) => conformsToPattern(pattern, v))) {
          conformantLocs.push(loc);
        }
      }

      return conformantLocs;
    }
    case "type":
    case "profile": {
      throw new Error("Not supported");
    }
  }
  throw new Error("invalid");
}

export async function validateSlice(
  elements: ElementDefinition[],
  sliceIndex: number,
  root: object,
  sliceValueLocs: Loc<any, any, any>[],
) {
  for (const sliceValueLoc of sliceValueLocs) {
    const sliceElement = elements[sliceIndex];
    const patternCheck = await fp.evaluate("$this.pattern", sliceElement);
    const sliceValue = get(sliceValueLoc, root);
    const fixedValueCheck = await fp.evaluate("$this.fixed", sliceElement);

    if (patternCheck && !conformsToPattern(patternCheck[0], sliceValue)) {
      throw new OperationError(outcomeError("exception", "pattern mismatch"));
    }
    if (fixedValueCheck) {
      if (JSON.stringify(fixedValueCheck[0]) !== JSON.stringify(sliceValue)) {
        throw new OperationError(
          outcomeError("exception", "fixed value mismatch"),
        );
      }

      const childrenIndices = eleIndexToChildIndices(elements, sliceIndex);

      for (const child of childrenIndices) {
        const field = fieldName(elements[child]);
        const fieldLoc = descend(sliceValueLoc, field);
        validateSlice(elements, child, root, [fieldLoc]);
      }
    }
  }
}

export async function splitSlicing(
  elements: ElementDefinition[],
  sliceDescriptor: SlicingDescriptor,
  root: object,
  loc: Loc<any, any, any>,
): Promise<Record<number, Loc<any, any, any>[]>> {
  const sliceSplit = sliceDescriptor.slices.reduce(
    (acc: Record<number, Loc<any, any, any>[]>, sliceIndex) => {
      acc[sliceIndex] = [];
      return acc;
    },
    {},
  );

  const values = get(loc, root);

  if (!Array.isArray(values)) {
    throw new OperationError(
      outcomeFatal("not-supported", "Cannot slice non array."),
    );
  }

  let locsToCheck = values.map((_v: unknown, i: number) => descend(loc, i));

  // A couple of notes we will determine per discriminator the element path that should be expected.
  // Using that we will loop over the slices and determine if value conforms to slice element using discriminator.

  // [Serialized as a group] The entries must be adjacent for a given slice.
  const discriminatorElement = elements[sliceDescriptor.discriminator];
  const discriminators = discriminatorElement.slicing?.discriminator ?? [];
  const discriminatorElementPaths = discriminators.map((d) =>
    convertPathToElementPointer(discriminatorElement, d),
  );

  for (const sliceIndex of sliceDescriptor.slices) {
    let sliceValueLocs = locsToCheck;
    for (let d = 0; d < discriminators.length; d++) {
      const discriminator = discriminators[d];
      const sliceDiscriminatorElementIndex =
        findElementDefinitionForSliceDiscriminator(
          discriminatorElementPaths[d],
          elements,
          sliceIndex,
        );

      if (!sliceDiscriminatorElementIndex)
        throw new OperationError(
          outcomeError(
            "invalid",
            "could not find element definition to use for slice discriminator.",
          ),
        );

      const sliceElement = elements[sliceDiscriminatorElementIndex];

      sliceValueLocs = await isConformantToSlicesDiscriminator(
        discriminator,
        sliceElement,
        root,
        sliceValueLocs,
      );
    }

    locsToCheck = locsToCheck.filter((l) => !sliceValueLocs.includes(l));
    sliceSplit[sliceIndex] = sliceValueLocs;
  }

  return sliceSplit;
}

function validateSliceCardinality(
  sliceElement: ElementDefinition,
  paths: Loc<any, any, any>[],
): OperationOutcomeIssue[] {
  const issues: OperationOutcomeIssue[] = [];
  if (paths.length < (sliceElement.min ?? 0)) {
    issues.push(
      issueError(
        "structure",
        `Slice '${sliceElement.sliceName}' does not have the minimum number of values.`,
      ),
    );
  }

  if (!isNaN(parseInt(sliceElement.max ?? "1"))) {
    const max = parseInt(sliceElement.max ?? "1");
    if (paths.length > max) {
      issues.push(
        issueError(
          "structure",
          `Slice '${sliceElement.sliceName}' has more than the maximum number of values.`,
        ),
      );
    }
  }

  return issues;
}

export async function validateSliceDescriptor(
  ctx: ValidationCTX,
  profile: Resource<FHIR_VERSION, "StructureDefinition">,
  sliceDescriptor: SlicingDescriptor,
  root: object,
  loc: Loc<any, any, any>,
): Promise<OperationOutcome["issue"]> {
  const snapshot = profile.snapshot?.element ?? [];
  const discriminatorElement = snapshot[sliceDescriptor.discriminator];
  const sliceLoc = descend(loc, fieldName(discriminatorElement));

  const slices = await splitSlicing(snapshot, sliceDescriptor, root, sliceLoc);

  let issues: OperationOutcome["issue"] = [];
  const snapshotLoc = descend(
    descend(pointer("StructureDefinition", profile.id as id), "snapshot"),
    "element",
  );

  for (const slice of sliceDescriptor.slices) {
    const sliceLoc = descend(snapshotLoc, slice) as unknown as ElementLoc;
    const sliceElement = get(sliceLoc, profile);

    if (!sliceElement) {
      throw new OperationError(
        outcomeError("not-found", `Slice element not found at '${sliceLoc}'`),
      );
    }

    const type = sliceElement.type ?? [];
    issues = issues.concat(
      validateSliceCardinality(sliceElement, slices[slice]),
    );

    if (type.length > 1) {
      throw new OperationError(
        outcomeError("not-supported", "typechoices not supported for slicing."),
      );
    }

    for (const path of slices[slice]) {
      issues = issues.concat(
        await validateElementSingular(
          ctx,
          profile,
          sliceLoc,
          root,
          path,
          type[0].code,
        ),
      );
    }
  }

  return issues;
}

export default async function validateAllSlicesAtLocation(
  ctx: ValidationCTX,
  profile: Resource<FHIR_VERSION, "StructureDefinition">,
  elementLoc: ElementLoc,
  root: object,
  loc: Loc<any, any, any>,
): Promise<OperationOutcomeIssue[]> {
  const sliceIndices = getSliceIndices(profile, elementLoc);

  return (
    await Promise.all(
      sliceIndices.map((sliceIndex) =>
        validateSliceDescriptor(ctx, profile, sliceIndex, root, loc),
      ),
    )
  ).flat();
}
