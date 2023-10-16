import {
  OperationError,
  outcomeError,
  outcomeFatal,
  issueError,
} from "@iguhealth/operation-outcomes";
import {
  ElementDefinition,
  OperationOutcome,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { primitiveTypes, resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { eleIndexToChildIndices } from "@iguhealth/codegen";
import { descend, createPath, ascend } from "./path.js";
import jsonpointer from "jsonpointer";

export interface ValidationCTX {
  resolveSD(type: string): StructureDefinition;
  validateCode?(system: string, code: string): Promise<boolean>;
}

type Validator = (input: any) => Promise<OperationOutcome["issue"]>;

// Create a validator for a given fhir type and value

const REGEX: Record<string, RegExp> = {
  // base64Binary: /^(\s*([0-9a-zA-Z+=]){4}\s*)+$/,
  uuid: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  time: /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/,
  oid: /^urn:oid:[0-2](\.(0|[1-9][0-9]*))+$/,
  unsignedInt: /^([0]|([1-9][0-9]*))$/,
  positiveInt: /^(\+?[1-9][0-9]*)$/,
  instant:
    /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))$/,
  id: /^[A-Za-z0-9\-.]{1,64}$/,
  date: /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$/,
  dateTime:
    /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/,
};

async function validatePrimitive(
  ctx: ValidationCTX,
  element: ElementDefinition | undefined,
  root: any,
  path: string,
  type: string
): Promise<OperationOutcome["issue"]> {
  const value = jsonpointer.get(root, path);
  switch (type) {
    case "http://hl7.org/fhirpath/System.String":
    case "date":
    case "dateTime":
    case "time":
    case "instant":
    case "id":
    case "string":
    case "xhtml":
    case "markdown":
    case "base64Binary":
    case "uri":
    case "uuid":
    case "canonical":
    case "oid":
    case "url": {
      if (typeof value !== "string") {
        return [
          issueError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          ),
        ];
      }
      if (REGEX[type] && !REGEX[type].test(value)) {
        return [
          issueError(
            "value",
            `Invalid value '${value}' at path '${path}'. Value must conform to regex '${REGEX[type]}'`,
            [path]
          ),
        ];
      }

      return [];
    }

    case "boolean": {
      if (typeof value !== "boolean") {
        return [
          issueError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          ),
        ];
      }
      return [];
    }

    case "code": {
      const strength = element?.binding?.strength;
      const valueSet = element?.binding?.valueSet;
      if (typeof value !== "string") {
        return [
          issueError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          ),
        ];
      }

      if (strength === "required" && valueSet && ctx.validateCode) {
        const isValid = await ctx.validateCode(valueSet, value);
        if (!isValid) {
          return [
            issueError(
              "structure",
              `Code '${value}' is not in value set '${valueSet}' at path '${path}'`,
              [path]
            ),
          ];
        }
      }

      return [];
    }
    case "integer":
    case "positiveInt":
    case "unsignedInt":
    case "decimal": {
      if (typeof value !== "number") {
        return [
          issueError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          ),
        ];
      }
      if (REGEX[type] && !REGEX[type].test(value.toString())) {
        return [
          issueError(
            "value",
            `Invalid value '${value}' at path '${path}'. Value must conform to regex '${REGEX[type]}'`,
            [path]
          ),
        ];
      }
      return [];
    }
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

function isElement(
  element: ElementDefinition | undefined
): element is ElementDefinition {
  if (!element) return false;
  return true;
}

function isTypeChoice(element: ElementDefinition) {
  return (element.type || []).length > 1;
}

function fieldName(elementDefinition: ElementDefinition, type?: string) {
  const field = elementDefinition.path.split(".").pop() as string;
  if (isTypeChoice(elementDefinition)) {
    if (!type)
      throw new Error("deriving field from typechoice requires a type");
    return field.replace("[x]", capitalize(type));
  }
  return field;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isPrimitiveType(type: string) {
  return primitiveTypes.has(type);
}

function resolveContentReferenceIndex(
  sd: StructureDefinition,
  element: ElementDefinition
): number {
  const contentReference = element.contentReference?.split("#")[1];
  const referenceElementIndex = sd.snapshot?.element.findIndex(
    (element) => element.id === contentReference
  );
  if (!referenceElementIndex)
    throw new Error(
      "unable to resolve contentreference: '" + element.contentReference + "'"
    );
  return referenceElementIndex;
}

function findBaseFieldAndType(
  element: ElementDefinition,
  value: any
): [string, string] | undefined {
  if (element.contentReference) {
    return [fieldName(element), element.type?.[0].code || ""];
  }
  for (const type of element.type?.map((t) => t.code) || []) {
    const field = fieldName(element, type);
    if (field in value) {
      return [field, type];
    }
  }
}

function determineTypesAndFields(
  element: ElementDefinition,
  value: any
): [string, string][] {
  let fields: [string, string][] = [];
  const base = findBaseFieldAndType(element, value);
  if (base) {
    fields.push(base);
    const [field, type] = base;
    if (isPrimitiveType(type)) {
      const primitiveElementField: [string, string] = [`_${field}`, "Element"];
      if (`_${field}` in value) fields.push(primitiveElementField);
    }
  } else {
    // Check for primitive extensions when non existent values
    const primitives =
      element.type?.filter((type) => isPrimitiveType(type.code)) || [];
    for (const primType of primitives) {
      if (`_${fieldName(element, primType.code)}` in value) {
        const primitiveElementField: [string, string] = [
          `_${fieldName(element, primType.code)}`,
          "Element",
        ];
        fields.push(primitiveElementField);
      }
    }
  }
  return fields;
}

async function validateSingular(
  ctx: ValidationCTX,
  path: string,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  root: any,
  type: string
): Promise<OperationOutcome["issue"]> {
  const element = structureDefinition.snapshot?.element?.[
    elementIndex
  ] as ElementDefinition;

  const childrenIndices = eleIndexToChildIndices(
    structureDefinition.snapshot?.element || [],
    elementIndex
  );

  // Leaf validation
  if (childrenIndices.length === 0) {
    if (element.contentReference) {
      const referenceElementIndex = resolveContentReferenceIndex(
        structureDefinition,
        element
      );
      return validateSingular(
        ctx,
        path,
        structureDefinition,
        referenceElementIndex,
        root,
        type
      );
    } else if (
      isPrimitiveType(type) ||
      type === "http://hl7.org/fhirpath/System.String"
    ) {
      // Element Check.
      let issues: OperationOutcome["issue"] = [];
      const { parent, field } = ascend(path) || {};
      if (field === undefined)
        throw new Error(
          `No field found on path ${path} for sd ${structureDefinition.id}`
        );
      return issues.concat(
        await validatePrimitive(ctx, element, root, path, type)
      );
    } else {
      if (type === "Resource" || type === "DomainResource") {
        type = jsonpointer.get(root, descend(path, "resourceType"));
      }
      return validate(ctx, type, root, path);
    }
  } else {
    // Validating root / backbone / element nested types here.
    // Need to validate that only the _field for primitives
    // And the typechoice check on each field.
    // Found concatenate on found fields so can check at end whether their are additional and throw error.
    let foundFields: string[] = [];
    const value = jsonpointer.get(root, path);

    if (typeof value !== "object") {
      return [
        issueError(
          "structure",
          `Invalid type '${typeof value}' at path '${path}`,
          [path]
        ),
      ];
    }

    const requiredElements = childrenIndices.filter(
      (index) => (structureDefinition.snapshot?.element?.[index].min || 0) > 0
    );
    const optionalElements = childrenIndices.filter(
      (i) => requiredElements.indexOf(i) === -1
    );

    let issues = (
      await Promise.all(
        requiredElements.map(async (index) => {
          const child = structureDefinition.snapshot?.element?.[index];
          if (!child) throw new Error("Child not found");

          const fields = determineTypesAndFields(child, value);
          if (fields.length === 0) {
            return [
              issueError(
                "structure",
                `Missing required field '${child.path}' at path '${path}'`,
                [path]
              ),
            ];
          }
          const { issues, fieldsFound } = await checkFields(
            ctx,
            path,
            structureDefinition,
            index,
            root,
            fields
          );
          foundFields = foundFields.concat(fieldsFound);
          return issues;
        })
      )
    ).flat();

    issues = [
      ...issues,
      ...(
        await Promise.all(
          optionalElements.map(async (index) => {
            const child = structureDefinition.snapshot?.element?.[index];
            if (!child) throw new Error("Child not found");

            const fields = determineTypesAndFields(child, value);
            const { issues, fieldsFound } = await checkFields(
              ctx,
              path,
              structureDefinition,
              index,
              root,
              fields
            );
            foundFields = foundFields.concat(fieldsFound);
            return issues;
          })
        )
      ).flat(),
    ];

    // Check for additional fields
    let additionalFields = Object.keys(value).filter(
      (field) => foundFields.indexOf(field) === -1
    );

    if (elementIndex === 0 && structureDefinition.kind === "resource") {
      if (value.resourceType !== structureDefinition.type) {
        throw new OperationError(
          outcomeError(
            "structure",
            `Expected resourceType '${structureDefinition.type}' at path '${path}'`,
            [path]
          )
        );
      }
      additionalFields = additionalFields.filter((v) => v !== "resourceType");
    }

    if (additionalFields.length > 0) {
      issues = [
        ...issues,
        issueError(
          "structure",
          `Additional fields found at path '${path}': '${additionalFields.join(
            ", "
          )}'`,
          [path]
        ),
      ];
    }

    return issues;
  }
}
async function checkFields(
  ctx: ValidationCTX,
  path: string,
  structureDefinition: StructureDefinition,
  index: number,
  root: any,
  fields: [string, string][]
): Promise<{
  fieldsFound: string[];
  issues: OperationOutcome["issue"];
}> {
  const fieldsFound: string[] = [];
  const issues = (
    await Promise.all(
      fields.map((fieldType) => {
        const [field, type] = fieldType;
        fieldsFound.push(field);
        return validateElement(
          ctx,
          descend(path, field),
          structureDefinition,
          index,
          root,
          type
        );
      })
    )
  ).flat();

  return { issues, fieldsFound };
}

async function validateElement(
  ctx: ValidationCTX,
  path: string,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  root: any,
  type: string
): Promise<OperationOutcome["issue"]> {
  const value = jsonpointer.get(root, path);
  const element = structureDefinition.snapshot?.element?.[elementIndex];

  if (!isElement(element)) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Element not found at ${elementIndex} for StructureDefinition ${structureDefinition.id}`,
        [path]
      )
    );
  }

  const isArray = element.max === "*" || parseInt(element.max || "1") > 1;
  // Validating cardinality
  // Cardinality set to * on root element so just ignore it.
  if (
    isArray != Array.isArray(value === undefined ? [] : value) &&
    elementIndex !== 0
  ) {
    return [
      issueError(
        "structure",
        `Element at path '${path}' is expected to be ${
          isArray ? "an array" : "a singular value"
        }.`,
        [path]
      ),
    ];
  }

  if (Array.isArray(value === undefined ? [] : value)) {
    // Validate each element in the array
    return (
      await Promise.all(
        (value || []).map((v: any, i: number) => {
          return validateSingular(
            ctx,
            descend(path, i),
            structureDefinition,
            elementIndex,
            root,
            type
          );
        })
      )
    ).flat();
  } else {
    return validateSingular(
      ctx,
      path,
      structureDefinition,
      elementIndex,
      root,
      type
    );
  }
}

export default async function validate(
  ctx: ValidationCTX,
  type: string,
  value: NonNullable<any>,
  path: string = createPath()
): Promise<OperationOutcome["issue"]> {
  const sd = ctx.resolveSD(type);
  const indice = 0;

  if (primitiveTypes.has(type))
    return validatePrimitive(ctx, undefined, value, path, type);

  return validateElement(
    ctx,
    path,
    sd,
    indice,
    value,
    // This should only be one at the root.
    sd.snapshot?.element[indice].type?.[0].code as string
  );
}

export function createValidator(
  ctx: ValidationCTX,
  type: string,
  path: string = createPath()
): Validator {
  return (value: NonNullable<any>) => {
    return validate(ctx, type, value, path);
  };
}
