/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loc, get, toJSONPointer } from "@iguhealth/fhir-pointer";
import {
  ElementDefinition,
  OperationOutcomeIssue,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import * as fp from "@iguhealth/fhirpath";
import { issueError } from "@iguhealth/operation-outcomes";

export function conformsToValue(
  expectedValue: unknown,
  foundValue: unknown,
): boolean {
  return JSON.stringify(expectedValue) === JSON.stringify(foundValue);
}

export async function validateFixedValue(
  element: ElementDefinition,
  root: object,
  path: Loc<any, any, any>,
): Promise<Array<OperationOutcomeIssue>> {
  const expectedValue = (
    await fp.evaluate("value", element, { type: "ElementDefinition" as uri })
  )[0];

  const value = get(path, root);
  if (!expectedValue) return [];

  if (!conformsToValue(expectedValue, value)) {
    return [
      issueError(
        "structure",
        `Value does not conform to fixed value ${JSON.stringify(expectedValue)}.`,
        [toJSONPointer(path)],
      ),
    ];
  }

  return [];
}
