import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import { ElementDefinition, StructureDefinition } from "@iguhealth/fhir-types";
import { primitiveTypes } from "@iguhealth/fhir-types/r4/sets";
import { traversalBottomUp } from "@iguhealth/codegen";

type Validator = (input: any) => Promise<boolean>;

// Create a validator for a given fhir type and value

function validatePrimitive(path: string, type: string, value: any) {
  switch (type) {
    default:
      throw new OperationError(
        outcomeError(
          "structure",
          `Unknown primitive type '${type}' at path '${path}'`,
          [path]
        )
      );
  }
}

function validateElement(
  resolveType: (string) => StructureDefinition,
  path: string,
  element: ElementDefinition,
  value: any
) {
  // Need to handle cardinalities
  // Need to handle backboneelements + elements
  const pieces = element.path.split(".");
  path = path + "." + pieces[pieces.length - 1];

  const type = element.type?.[0].code as string;
  if (primitiveTypes.has(type)) {
    return validatePrimitive(path, type, value);
  } else {
    const validator = createValidator(resolveType, type, value);
    return validator(value);
  }
}

const cachedValidators: Record<string, Validator> = {};

function createValidator(
  resolveType: (string) => StructureDefinition,
  type: string,
  value: any
): Validator {
  const sd = resolveType(type);
  const indice = 0;

  const validator = async (input) => {
    return false;
  };

  return validator;
}
