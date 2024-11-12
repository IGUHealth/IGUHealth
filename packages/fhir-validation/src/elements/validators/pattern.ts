/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loc, get, toJSONPointer } from "@iguhealth/fhir-pointer";
import {
  ElementDefinition,
  OperationOutcomeIssue,
} from "@iguhealth/fhir-types/r4/types";
import * as fp from "@iguhealth/fhirpath";
import { issueError } from "@iguhealth/operation-outcomes";

import { conformsToPattern } from "../conformance.js";

export async function validatePattern(
  element: ElementDefinition,
  root: object,
  path: Loc<any, any, any>,
): Promise<Array<OperationOutcomeIssue>> {
  const pattern = (await fp.evaluate("pattern", element))[0];
  const value = get(path, root);

  if (!pattern) return [];

  if (!conformsToPattern(pattern, value))
    return [
      issueError(
        "structure",
        `Value does not conform to pattern ${JSON.stringify(pattern)}.`,
        [toJSONPointer(path)],
      ),
    ];

  return [];
}
