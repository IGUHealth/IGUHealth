/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loc, get, toJSONPointer } from "@iguhealth/fhir-pointer";
import {
  ElementDefinition,
  OperationOutcomeIssue,
} from "@iguhealth/fhir-types/r4/types";
import { issueError } from "@iguhealth/operation-outcomes";

import { ElementLoc } from "../../types.js";
import { ascendElementLoc } from "../../utilities.js";

/**
 * Returns whether the value should be respresented as an array given max cardinality
 * @param max either a string number or *
 * @returns
 */
function isArray(element: ElementDefinition, elementIndex: number): boolean {
  // Because SDs at root are always max cardinality just set it to zero to avoid this.
  if (elementIndex === 0) return false;
  const max = element.base?.max ?? element.max ?? "1";
  if (!max) return false;
  const parsed = parseInt(max);
  if (!isNaN(parsed)) {
    return parsed > 1;
  }
  return max === "*";
}

function getMin(elementDefinition: ElementDefinition) {
  return elementDefinition.min ?? 0;
}

function getMax(elementDefinition: ElementDefinition) {
  return elementDefinition.max ?? "1";
}

export function validateCardinality(
  element: ElementDefinition,
  // Need this to check indice as specified below element zero indices are specified as array when we want to validate them as singular.
  elementLoc: ElementLoc,
  root: object,
  path: Loc<any, any, any>,
): Array<OperationOutcomeIssue> {
  const { field: elementIndex } = ascendElementLoc(elementLoc);
  const value = get(path, root);

  const max = getMax(element);
  const min = getMin(element);

  // Value could be undefined if min is allowed to be zero.
  if (value === undefined && min === 0) return [];
  const isElementAnArray = isArray(element, elementIndex as number);

  if (Array.isArray(value) !== isElementAnArray) {
    return [
      issueError(
        "structure",
        `Element is expected to be ${isElementAnArray ? "an array" : "a singular value"}.`,
        [toJSONPointer(path)],
      ),
    ];
  }
  if (isElementAnArray) {
    if (value.length < min) {
      return [
        issueError(
          "structure",
          `Element is expected to have at least ${min} items.`,
          [toJSONPointer(path)],
        ),
      ];
    }
    if (max !== "*" && value > parseInt(max))
      return [
        issueError(
          "structure",
          `Element is expected to have at most ${max} items.`,
          [toJSONPointer(path)],
        ),
      ];

    return [];
  } else {
    if (min > 0 && value === undefined) {
      return [
        issueError(
          "structure",
          `Element is expected to have at least ${min} items.`,
          [toJSONPointer(path)],
        ),
      ];
    }
    return [];
  }
}
