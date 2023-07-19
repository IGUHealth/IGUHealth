import { ElementDefinition, StructureDefinition } from "@iguhealth/fhir-types";
import { primitiveTypes } from "@iguhealth/fhir-types/r4/sets";

type Validator = (input: any) => Promise<boolean>;

// Create a validator for a given fhir type and value

function validatePrimitive(path: string, type: string, value: any) {
    switch(type){
        default:
            throw new 
    }
}

function validateElement(
  path: string,
  resolveType: (string) => StructureDefinition,
  element: ElementDefinition,
  value: any
) {
  // Need to handle cardinalities
  // Need to handle backboneelements + elements
  const pieces = element.path.split(".");
  path = path + "." + pieces[pieces.length - 1];

  const type = element.type?.[0].code as string;
  if (primitiveTypes.has(type)) {
    return validatePrimitive(type, value);
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

  const validator = async (input) => {
    return false;
  };

  return validator;
}
