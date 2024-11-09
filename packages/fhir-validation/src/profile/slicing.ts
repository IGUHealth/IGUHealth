/* eslint-disable @typescript-eslint/no-explicit-any */
import { eleIndexToChildIndices } from "@iguhealth/codegen/traversal/structure-definition";
import {
  ElementDefinition,
  OperationOutcome,
  OperationOutcomeIssue,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import * as fp from "@iguhealth/fhirpath";
import {
  convertPathToElementPointer,
  Discriminator,
  removeTypeOnPath,
} from "./utilities.js";
import {
  issueError,
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { fieldName } from "../utilities.js";
import { conformsToPattern } from "./validators.js";
import {
  ascend,
  descend,
  get,
  Loc,
  toJSONPointer,
} from "@iguhealth/fhir-pointer";
import { metaValue } from "@iguhealth/meta-value/v2";
import { FHIR_VERSION, R4, Resource } from "@iguhealth/fhir-types/versions";
import { validateSingular } from "../structural/index.js";
import { ValidationCTX } from "../types.js";

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
  elements: ElementDefinition[],
  index: number,
): SlicingDescriptor[] {
  const children = eleIndexToChildIndices(elements, index);

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
        await fp.evaluate("$this.fixed", sliceValueElementDefinition)
      )[0];
      const conformantLocs: Loc<any, any, any>[] = [];

      for (const loc of locs) {
        const value = get(loc, root);
        const evaluation = await fp.evaluate(discriminator.path, value);
        if (
          evaluation.find(
            (v) => JSON.stringify(v) === JSON.stringify(expectedValue),
          ) !== undefined
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

async function validateSliceValues(
  elements: ElementDefinition[],
  sliceIndex: number,
  root: object,
  valueLocs: Loc<any, any, any>[],
) {
  throw new Error();
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
      const sliceElementIndex = findElementDefinitionForSliceDiscriminator(
        discriminatorElementPaths[d],
        elements,
        sliceIndex,
      );

      if (!sliceElementIndex)
        throw new OperationError(
          outcomeError(
            "invalid",
            "could not find element definition for slice",
          ),
        );

      const sliceElement = elements[sliceElementIndex];

      sliceValueLocs = await isConformantToSlicesDiscriminator(
        discriminator,
        sliceElement,
        root,
        locsToCheck,
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

export async function validateSlices(
  ctx: ValidationCTX,
  structureDefinition: Resource<FHIR_VERSION, "StructureDefinition">,
  sliceDescriptor: SlicingDescriptor,
  root: object,
  _loc: Loc<any, any, any>,
): Promise<OperationOutcome["issue"]> {
  const differential = structureDefinition.differential?.element ?? [];
  const discriminatorElement = differential[sliceDescriptor.discriminator];
  const loc = descend(_loc, fieldName(discriminatorElement));

  const slices = await splitSlicing(differential, sliceDescriptor, root, loc);

  let issues: OperationOutcome["issue"] = [];

  for (const slice of sliceDescriptor.slices) {
    const idx = (structureDefinition?.snapshot?.element ?? []).findIndex(
      (e) => e.id === differential[slice].id,
    );
    const sliceElement = (structureDefinition?.snapshot?.element ?? [])[idx];
    const type = sliceElement.type ?? [];
    issues = issues.concat(
      validateSliceCardinality(sliceElement, slices[slice]),
    );

    for (const path of slices[slice]) {
      if (type.length !== 1) {
        throw new OperationError(
          outcomeError(
            "not-supported",
            "typechoices not supported for slicing.",
          ),
        );
      }

      issues = issues.concat(
        await validateSingular(
          ctx,
          path,
          structureDefinition,
          idx,
          root,
          type[0].code,
        ),
      );
    }
  }

  return issues;
}
