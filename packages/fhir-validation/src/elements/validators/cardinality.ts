import { ElementDefinition } from "@iguhealth/fhir-types/r4/types";

/**
 * Returns whether the value should be respresented as an array given max cardinality
 * @param max either a string number or *
 * @returns
 */
function isArray(max: string | undefined) {
  if (!max) return false;
  const parsed = parseInt(max);
  if (!isNaN(parsed)) {
    return parsed > 1;
  }
  return max === "*";
}

function shouldElementBeArray(elementDefinition: ElementDefinition) {
  return isArray(elementDefinition.base?.max ?? elementDefinition.max);
}

export function validateCardinality(
  element: ElementDefinition,
  value: unknown,
): {};
