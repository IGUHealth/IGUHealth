import { primitiveTypes, resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { ElementDefinition } from "@iguhealth/fhir-types/r4/types";

export function validateIsObject(v: unknown): v is object {
  return typeof v === "object" && v !== null;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isPrimitiveType(type: string) {
  return primitiveTypes.has(type);
}

export function notNull<T, Z extends T | undefined>(
  element: Z,
): element is NonNullable<Z> {
  if (element === undefined || element === null) return false;
  return true;
}

/**
 * Per spec the ID can be used to determine if typechoice
 * See https://hl7.org/fhir/R4/elementdefinition.html#id
 * For type choice elements, the id reflects the type slice. e.g. For path = Patient.deceasedBoolean, the id is Patient.deceased[x]:deceasedBoolean
 * @param element
 * @returns
 */
export function isTypeChoice(element: ElementDefinition) {
  return element.id?.endsWith("[x]");
}

export function isResourceType(type: string) {
  return resourceTypes.has(type);
}

export function fieldName(elementDefinition: ElementDefinition, type?: string) {
  const field = elementDefinition.path.split(".").pop() as string;
  if (isTypeChoice(elementDefinition)) {
    if (!type)
      throw new Error("deriving field from typechoice requires a type");
    return field.replace("[x]", capitalize(type));
  }
  return field;
}
