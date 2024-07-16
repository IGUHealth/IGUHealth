/* eslint-disable @typescript-eslint/no-explicit-any */
import { eleIndexToChildIndices as eleIndexToChildIndexes } from "@iguhealth/codegen";
import {
  Loc,
  descend,
  get,
  toJSONPointer,
  typedPointer,
} from "@iguhealth/fhir-pointer";
import { primitiveTypes, resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  ElementDefinition,
  OperationOutcome,
  Reference,
  StructureDefinition,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import {
  OperationError,
  issueError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { validatePrimitive } from "./primitive.js";
import { ValidationCTX, Validator } from "./types.js";
import { validateIsObject } from "./utilities.js";

export { ValidationCTX };
// Create a validator for a given fhir type and value

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
  sd: StructureDefinition | r4b.StructureDefinition,
  element: ElementDefinition | r4b.ElementDefinition,
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
  const fields: [string, uri][] = [];
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
  const value = get(path, root) as Reference;

  const referenceProfiles = element.type?.find(
    (t) => t.code === "Reference",
  )?.targetProfile;
  if (referenceProfiles === undefined || referenceProfiles?.length === 0)
    return [];
  for (const profile of referenceProfiles || []) {
    const sd = await ctx.resolveCanonical(
      ctx.fhirVersion,
      "StructureDefinition",
      profile,
    );
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

/**
 * Validating root / backbone / element nested types here.
 */
async function validateComplex(
  ctx: ValidationCTX,
  path: Loc<object, any, any>,
  structureDefinition: StructureDefinition | r4b.StructureDefinition,
  elementIndex: number,
  root: object,
  childrenIndexes: number[],
): Promise<OperationOutcome["issue"]> {
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
        if (!child) throw new Error("Child not found");

        const fields = determineTypesAndFields(child, value);
        foundFields = foundFields.concat(fields.map((f) => f[0]));

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
        return checkFields(ctx, path, structureDefinition, index, root, fields);
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
          foundFields = foundFields.concat(fields.map((f) => f[0]));
          return checkFields(
            ctx,
            path,
            structureDefinition,
            index,
            root,
            fields,
          );
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
  structureDefinition: StructureDefinition | r4b.StructureDefinition,
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
  structureDefinition: StructureDefinition | r4b.StructureDefinition,
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
  structureDefinition: StructureDefinition | r4b.StructureDefinition,
  index: number,
  root: object,
  fields: [string, uri][],
): Promise<OperationOutcome["issue"]> {
  const issues = (
    await Promise.all(
      fields.map((fieldType) => {
        const [field, type] = fieldType;
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

  return issues;
}

async function validateElement(
  ctx: ValidationCTX,
  path: Loc<any, any, any>,
  structureDefinition: StructureDefinition | r4b.StructureDefinition,
  elementIndex: number,
  root: object,
  type: uri,
): Promise<OperationOutcome["issue"]> {
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
  const value = get(path, root) ?? (isArray ? [] : undefined);

  if (
    isArray != Array.isArray(value) &&
    // Validating cardinality
    // Cardinality set to * on root element so just ignore it.
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

  if (Array.isArray(value)) {
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
  if (primitiveTypes.has(type))
    return validatePrimitive(ctx, undefined, root, path, type);

  const canonical = await ctx.resolveTypeToCanonical(ctx.fhirVersion, type);
  if (!canonical) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Unable to resolve canonical for type '${type}'`,
        [toJSONPointer(path)],
      ),
    );
  }
  const sd = await ctx.resolveCanonical(
    ctx.fhirVersion,
    "StructureDefinition",
    canonical,
  );
  if (!sd)
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Unable to resolve canonical for type '${type}'`,
        [toJSONPointer(path)],
      ),
    );

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
          (root as Resource<FHIR_VERSION, AllResourceTypes>).resourceType
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
