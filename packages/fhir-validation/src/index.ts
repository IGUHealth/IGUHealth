import { eleIndexToChildIndices as eleIndexToChildIndexes } from "@iguhealth/codegen";
import {
  Loc,
  descend,
  get,
  root,
  toJSONPointer,
  typedPointer,
} from "@iguhealth/fhir-pointer";
import { primitiveTypes, resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  AResource,
  ElementDefinition,
  OperationOutcome,
  Reference,
  Resource,
  ResourceType,
  StructureDefinition,
  canonical,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  issueError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

export interface ValidationCTX {
  resolveTypeToCanonical(type: uri): canonical | undefined;
  resolveCanonical<T extends ResourceType>(
    type: T,
    url: string,
  ): AResource<T> | undefined;
  validateCode?(system: string, code: string): Promise<boolean>;
}

type Validator = (input: unknown) => Promise<OperationOutcome["issue"]>;

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
  rootValue: unknown,
  path: Loc<object, any, any>,
  type: string,
): Promise<OperationOutcome["issue"]> {
  let value;
  if (validateIsObject(rootValue)) value = get(path, rootValue);
  else if (path === root(path)) value = rootValue;
  else {
    return [
      issueError(
        "structure",
        `Expected primitive type '${type}' at path '${toJSONPointer(path)}'`,
        [toJSONPointer(path)],
      ),
    ];
  }

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
            `Expected primitive type '${type}' at path '${toJSONPointer(
              path,
            )}'`,
            [toJSONPointer(path)],
          ),
        ];
      }
      if (REGEX[type] && !REGEX[type].test(value)) {
        return [
          issueError(
            "value",
            `Invalid value '${value}' at path '${toJSONPointer(
              path,
            )}'. Value must conform to regex '${REGEX[type]}'`,
            [toJSONPointer(path)],
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
            `Expected primitive type '${type}' at path '${toJSONPointer(
              path,
            )}'`,
            [toJSONPointer(path)],
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
            `Expected primitive type '${type}' at path '${toJSONPointer(
              path,
            )}'`,
            [toJSONPointer(path)],
          ),
        ];
      }

      if (strength === "required" && valueSet && ctx.validateCode) {
        const isValid = await ctx.validateCode(valueSet, value);
        if (!isValid) {
          return [
            issueError(
              "structure",
              `Code '${value}' is not in value set '${valueSet}' at path '${toJSONPointer(
                path,
              )}'`,
              [toJSONPointer(path)],
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
            `Expected primitive type '${type}' at path '${toJSONPointer(
              path,
            )}'`,
            [toJSONPointer(path)],
          ),
        ];
      }
      if (REGEX[type] && !REGEX[type].test(value.toString())) {
        return [
          issueError(
            "value",
            `Invalid value '${value}' at path '${toJSONPointer(
              path,
            )}'. Value must conform to regex '${REGEX[type]}'`,
            [toJSONPointer(path)],
          ),
        ];
      }
      return [];
    }
    default:
      throw new OperationError(
        outcomeError(
          "structure",
          `Unknown primitive type '${type}' at path '${toJSONPointer(path)}'`,
          [toJSONPointer(path)],
        ),
      );
  }
}

function isElement(
  element: ElementDefinition | undefined,
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
  element: ElementDefinition,
): number {
  const contentReference = element.contentReference?.split("#")[1];
  const referenceElementIndex = sd.snapshot?.element.findIndex(
    (element) => element.id === contentReference,
  );
  if (!referenceElementIndex)
    throw new Error(
      "unable to resolve contentreference: '" + element.contentReference + "'",
    );
  return referenceElementIndex;
}

function findBaseFieldAndType(
  element: ElementDefinition,
  value: object,
): [string, uri] | undefined {
  if (element.contentReference) {
    return [fieldName(element), (element.type?.[0].code || "") as uri];
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
  value: object,
): [string, uri][] {
  let fields: [string, uri][] = [];
  const base = findBaseFieldAndType(element, value);
  if (base) {
    fields.push(base);
    const [field, type] = base;
    if (isPrimitiveType(type)) {
      const primitiveElementField: [string, uri] = [
        `_${field}`,
        "Element" as uri,
      ];
      if (`_${field}` in value) fields.push(primitiveElementField);
    }
  } else {
    // Check for primitive extensions when non existent values
    const primitives =
      element.type?.filter((type) => isPrimitiveType(type.code)) || [];
    for (const primType of primitives) {
      if (`_${fieldName(element, primType.code)}` in value) {
        const primitiveElementField: [string, uri] = [
          `_${fieldName(element, primType.code)}`,
          "Element" as uri,
        ];
        fields.push(primitiveElementField);
      }
    }
  }
  return fields;
}

async function validateReferenceTypeConstraint(
  ctx: ValidationCTX,
  root: object,
  path: Loc<object, any, any>,
  element: ElementDefinition,
): Promise<OperationOutcome["issue"]> {
  // [Note] because element should already be validated as reference this can be considered safe?
  let value = get(path, root) as Reference;

  const referenceProfiles = element.type?.find(
    (t) => t.code === "Reference",
  )?.targetProfile;
  if (referenceProfiles === undefined || referenceProfiles?.length === 0)
    return [];
  for (const profile of referenceProfiles || []) {
    const sd = ctx.resolveCanonical("StructureDefinition", profile);
    // Domain or resource type means all types are allowed.
    if (sd?.type === "Resource" || sd?.type === "DomainResource") {
      return [];
    }
    if (value?.reference) {
      const resourceType = value.reference?.split("/")[0];
      // Could be ref in bundle so skip for now.
      if (!resourceTypes.has(resourceType)) {
        return [];
      }
      if (
        resourceType === sd?.type &&
        (value.type ? resourceType === value.type : true)
      )
        return [];
    } else if (value.type && value === sd?.type) return [];
    // Allow for reference type to be undefined.
    else if (value.type === undefined && value.reference === undefined)
      return [];
  }

  return [
    issueError(
      "structure",
      `Expected reference to be constrained by one of the following profiles '${referenceProfiles?.join(
        ", ",
      )}' at path '${toJSONPointer(path)}' found reference of type '${
        value.type ? value.type : value.reference?.split("/")[0]
      }' instead.`,
      [toJSONPointer(path)],
    ),
  ];
}

async function validateComplex(
  ctx: ValidationCTX,
  path: Loc<object, any, any>,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  root: object,
  childrenIndexes: number[],
): Promise<OperationOutcome["issue"]> {
  // Validating root / backbone / element nested types here.
  // Need to validate that only the _field for primitives
  // And the typechoice check on each field.
  // Found concatenate on found fields so can check at end whether their are additional and throw error.
  let foundFields: string[] = [];
  const value = get(path, root);

  if (typeof value !== "object") {
    return [
      issueError(
        "structure",
        `Invalid type '${typeof value}' at path '${toJSONPointer(path)}`,
        [toJSONPointer(path)],
      ),
    ];
  }

  const requiredElements = childrenIndexes.filter(
    (index) => (structureDefinition.snapshot?.element?.[index].min || 0) > 0,
  );
  const optionalElements = childrenIndexes.filter(
    (i) => requiredElements.indexOf(i) === -1,
  );

  let issues = (
    await Promise.all(
      requiredElements.map(async (index) => {
        const child = structureDefinition.snapshot?.element?.[index];
        console.log(child);
        if (!child) throw new Error("Child not found");

        const fields = determineTypesAndFields(child, value);
        if (fields.length === 0) {
          return [
            issueError(
              "structure",
              `Missing required field '${child.path}' at path '${toJSONPointer(
                path,
              )}'`,
              [toJSONPointer(path)],
            ),
          ];
        }
        const { issues, fieldsFound } = await checkFields(
          ctx,
          path,
          structureDefinition,
          index,
          root,
          fields,
        );
        foundFields = foundFields.concat(fieldsFound);
        return issues;
      }),
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
            fields,
          );
          foundFields = foundFields.concat(fieldsFound);
          return issues;
        }),
      )
    ).flat(),
  ];

  // Check for additional fields
  let additionalFields = Object.keys(value).filter(
    (field) => foundFields.indexOf(field) === -1,
  );

  if (elementIndex === 0 && structureDefinition.kind === "resource") {
    if (value.resourceType !== structureDefinition.type) {
      throw new OperationError(
        outcomeError(
          "structure",
          `Expected resourceType '${
            structureDefinition.type
          }' at path '${toJSONPointer(path)}' found type '${
            value.resourceType
          }'`,
          [toJSONPointer(path)],
        ),
      );
    }
    additionalFields = additionalFields.filter((v) => v !== "resourceType");
  }

  if (additionalFields.length > 0) {
    issues = [
      ...issues,
      issueError(
        "structure",
        `Additional fields found at path '${toJSONPointer(
          path,
        )}': '${additionalFields.join(", ")}'`,
        [toJSONPointer(path)],
      ),
    ];
  }

  return issues;
}

async function validateContentReference(
  ctx: ValidationCTX,
  path: Loc<object, any, any>,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  root: object,
  type: uri,
) {
  const element = structureDefinition.snapshot?.element?.[
    elementIndex
  ] as ElementDefinition;

  if (!element.contentReference) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Element at ${elementIndex} is not a content reference`,
      ),
    );
  }

  return validateSingular(
    ctx,
    path,
    structureDefinition,
    resolveContentReferenceIndex(structureDefinition, element),
    root,
    type,
  );
}

async function validateSingular(
  ctx: ValidationCTX,
  path: Loc<object, any, any>,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  root: object,
  type: uri,
): Promise<OperationOutcome["issue"]> {
  const element = structureDefinition.snapshot?.element?.[
    elementIndex
  ] as ElementDefinition;

  const childrenIndixes = eleIndexToChildIndexes(
    structureDefinition.snapshot?.element || [],
    elementIndex,
  );

  // Leaf validation
  if (element.contentReference)
    return validateContentReference(
      ctx,
      path,
      structureDefinition,
      elementIndex,
      root,
      type,
    );
  else if (childrenIndixes.length === 0) {
    if (
      isPrimitiveType(type) ||
      type === "http://hl7.org/fhirpath/System.String"
    ) {
      // Element Check.
      return validatePrimitive(ctx, element, root, path, type);
    } else {
      if (type === "Resource" || type === "DomainResource") {
        type = get(descend(path, "resourceType"), root);
      }
      const issues = await validate(ctx, type, root, path);
      // Special validation for reference to confirm the type constraint.
      if (issues.length === 0 && type === "Reference") {
        return await validateReferenceTypeConstraint(ctx, root, path, element);
      }
      return issues;
    }
  } else {
    return validateComplex(
      ctx,
      path,
      structureDefinition,
      elementIndex,
      root,
      childrenIndixes,
    );
  }
}
async function checkFields(
  ctx: ValidationCTX,
  path: Loc<object, any, any>,
  structureDefinition: StructureDefinition,
  index: number,
  root: object,
  fields: [string, uri][],
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
          type,
        );
      }),
    )
  ).flat();

  return { issues, fieldsFound };
}

function validateIsObject(v: unknown): v is object {
  return typeof v === "object" && v !== null;
}

async function validateElement(
  ctx: ValidationCTX,
  path: Loc<any, any, any>,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  root: object,
  type: uri,
): Promise<OperationOutcome["issue"]> {
  const value = get(path, root);
  const element = structureDefinition.snapshot?.element?.[elementIndex];

  if (!isElement(element)) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Element not found at ${elementIndex} for StructureDefinition ${structureDefinition.id}`,
        [toJSONPointer(path)],
      ),
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
        `Element at path '${toJSONPointer(path)}' is expected to be ${
          isArray ? "an array" : "a singular value"
        }.`,
        [toJSONPointer(path)],
      ),
    ];
  }

  if (Array.isArray(value === undefined ? [] : value)) {
    // Validate each element in the array
    return (
      await Promise.all(
        (value || []).map((_v: any, i: number) => {
          return validateSingular(
            ctx,
            descend(path, i),
            structureDefinition,
            elementIndex,
            root,
            type,
          );
        }),
      )
    ).flat();
  } else {
    return validateSingular(
      ctx,
      path,
      structureDefinition,
      elementIndex,
      root,
      type,
    );
  }
}

export default async function validate(
  ctx: ValidationCTX,
  type: uri,
  root: unknown,
  path: Loc<any, any, any> = typedPointer<any, any>(),
): Promise<OperationOutcome["issue"]> {
  const canonical = ctx.resolveTypeToCanonical(type);
  if (!canonical) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Unable to resolve canonical for type '${type}'`,
        [toJSONPointer(path)],
      ),
    );
  }
  const sd = ctx.resolveCanonical("StructureDefinition", canonical);
  if (!sd)
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Unable to resolve canonical for type '${type}'`,
        [toJSONPointer(path)],
      ),
    );

  if (primitiveTypes.has(type))
    return validatePrimitive(ctx, undefined, root, path, type);

  if (!validateIsObject(root))
    return [
      issueError(
        "structure",
        `Value must be an object when validating '${type}'. Instead found type of '${typeof root}'`,
        [toJSONPointer(path)],
      ),
    ];

  if (
    resourceTypes.has(type) &&
    get(descend(path, "resourceType"), root) !== type
  ) {
    return [
      issueError(
        "invalid",
        `ResourceType '${
          (root as Resource).resourceType
        }' does not match expected type '${type}'`,
        [toJSONPointer(path)],
      ),
    ];
  }

  return validateElement(ctx, path, sd, 0, root, type);
}

export function createValidator(
  ctx: ValidationCTX,
  type: uri,
  path: Loc<any, any, any> = typedPointer(),
): Validator {
  return (value: unknown) => {
    return validate(ctx, type, value, path);
  };
}
