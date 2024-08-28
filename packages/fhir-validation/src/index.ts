/* eslint-disable @typescript-eslint/no-explicit-any */
import { eleIndexToChildIndices as eleIndexToChildIndexes } from "@iguhealth/codegen/traversal/structure-definition";
import {
  Loc,
  descend,
  get,
  toJSONPointer,
  typedPointer,
} from "@iguhealth/fhir-pointer";
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

import { ValidationCTX, Validator } from "./types.js";
import {
  capitalize,
  isPrimitiveType,
  isResourceType,
  isTypeChoice,
  notNull,
  validateIsObject,
} from "./utilities.js";
import { validatePrimitive } from "./validate-primitive.js";

export { ValidationCTX };

function fieldName(elementDefinition: ElementDefinition, type?: string) {
  const field = elementDefinition.path.split(".").pop() as string;
  if (isTypeChoice(elementDefinition)) {
    if (!type)
      throw new Error("deriving field from typechoice requires a type");
    return field.replace("[x]", capitalize(type));
  }
  return field;
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

type FieldType = { field: string; type: uri };

function findBaseFieldAndType(
  element: ElementDefinition,
  value: object,
): FieldType | undefined {
  if (element.contentReference) {
    return {
      field: fieldName(element),
      type: (element.type?.[0].code ?? "") as uri,
    };
  }
  for (const type of element.type?.map((t) => t.code) || []) {
    const field = fieldName(element, type);
    if (field in value) {
      return { field, type };
    }
  }
}

function determineTypesAndFields(
  element: ElementDefinition,
  value: object,
): FieldType[] {
  const fields: FieldType[] = [];
  const base = findBaseFieldAndType(element, value);
  if (base) {
    fields.push(base);
    const { field, type } = base;
    if (isPrimitiveType(type)) {
      const primitiveElementField = {
        field: `_${field}`,
        type: "Element" as uri,
      };
      if (`_${field}` in value) fields.push(primitiveElementField);
    }
  } else {
    // Check for primitive extensions when non existent values
    const primitives =
      element.type?.filter((type) => isPrimitiveType(type.code)) || [];
    for (const primType of primitives) {
      if (`_${fieldName(element, primType.code)}` in value) {
        const primitiveElementField = {
          field: `_${fieldName(element, primType.code)}`,
          type: "Element" as uri,
        };
        fields.push(primitiveElementField);
      }
    }
  }
  return fields;
}

function isElementRequired(element: ElementDefinition) {
  return (element.min ?? 0) > 0;
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
      if (!isResourceType(resourceType)) {
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

  const issues = (
    await Promise.all(
      childrenIndexes.map(async (elementIndex) => {
        const element = structureDefinition.snapshot?.element?.[elementIndex];
        if (!notNull(element)) {
          throw new OperationError(
            outcomeFatal(
              "structure",
              `Element not found at ${elementIndex} for StructureDefinition ${structureDefinition.id}`,
              [toJSONPointer(path)],
            ),
          );
        }

        // Because Primitives can be extended under seperate key we must check multiple fields.
        const fields = determineTypesAndFields(element, value);
        foundFields = foundFields.concat(fields.map((f) => f.field));

        if (isElementRequired(element) && fields.length === 0) {
          return [
            issueError(
              "structure",
              `Missing required field '${element.path}' at path '${toJSONPointer(
                path,
              )}'`,
              [toJSONPointer(path)],
            ),
          ];
        }

        return (
          await Promise.all(
            fields.map((fieldType) =>
              validateElement(
                ctx,
                descend(path, fieldType.field),
                structureDefinition,
                elementIndex,
                root,
                fieldType.type,
              ),
            ),
          )
        ).flat();
      }),
    )
  ).flat();

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

  return additionalFields.length > 0
    ? [
        ...issues,
        issueError(
          "structure",
          `Additional fields found at path '${toJSONPointer(
            path,
          )}': '${additionalFields.join(", ")}'`,
          [toJSONPointer(path)],
        ),
      ]
    : issues;
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

  if (element.contentReference) {
    return validateSingular(
      ctx,
      path,
      structureDefinition,
      resolveContentReferenceIndex(structureDefinition, element),
      root,
      type,
    );
  }

  const childrenIndixes = eleIndexToChildIndexes(
    structureDefinition.snapshot?.element || [],
    elementIndex,
  );

  // Leaf validation
  if (childrenIndixes.length === 0) {
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

async function validateElement(
  ctx: ValidationCTX,
  path: Loc<any, any, any>,
  structureDefinition: StructureDefinition | r4b.StructureDefinition,
  elementIndex: number,
  root: object,
  type: uri,
): Promise<OperationOutcome["issue"]> {
  const element = structureDefinition.snapshot?.element?.[elementIndex];
  if (!notNull(element)) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Element not found at ${elementIndex} for StructureDefinition ${structureDefinition.id}`,
        [toJSONPointer(path)],
      ),
    );
  }

  const hasMany =
    (element.max === "*" || parseInt(element.max || "1") > 1) &&
    // Root element has * so ignore in this case.
    elementIndex !== 0;

  const value = get(path, root);

  switch (true) {
    // If min is zero than allow undefined.
    case element.min === 0 && value === undefined: {
      return [];
    }
    case Array.isArray(value): {
      if (!hasMany) {
        return [
          issueError(
            "structure",
            `Element is expected to be a singular value.`,
            [toJSONPointer(path)],
          ),
        ];
      }

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
    }
    default: {
      if (hasMany) {
        return [
          issueError("structure", `Element is expected to be an array.`, [
            toJSONPointer(path),
          ]),
        ];
      }
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
}

export default async function validate(
  ctx: ValidationCTX,
  type: uri,
  root: unknown,
  path: Loc<any, any, any> = typedPointer<any, any>(),
): Promise<OperationOutcome["issue"]> {
  if (isPrimitiveType(type))
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
    isResourceType(type) &&
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
