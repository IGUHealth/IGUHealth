/* eslint-disable @typescript-eslint/no-explicit-any */
import { eleIndexToChildIndices as eleIndexToChildIndexes } from "@iguhealth/codegen/traversal/structure-definition";
import {
  Loc,
  ascend,
  descend,
  get,
  pointer,
  toJSONPointer,
  typedPointer,
} from "@iguhealth/fhir-pointer";
import {
  ElementDefinition,
  OperationOutcome,
  Reference,
  StructureDefinition,
  id,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { isObject } from "@iguhealth/meta-value/utilities";
import {
  OperationError,
  issueError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { validatePrimitive } from "../elements/primitive.js";
import { validateCardinality } from "../elements/validators/cardinality.js";
import { ElementLoc, ValidationCTX } from "../types.js";
import {
  ascendElementLoc,
  fieldName,
  isPrimitiveType,
  isResourceType,
  notNullable,
  resolveTypeToStructureDefinition,
} from "../utilities.js";

function resolveContentReferenceIndex(
  sd: StructureDefinition | r4b.StructureDefinition,
  elementsLoc: Loc<StructureDefinition, ElementDefinition[]>,
  element: ElementDefinition | r4b.ElementDefinition,
): ElementLoc {
  const elements = get(elementsLoc, sd as StructureDefinition);
  const contentReference = element.contentReference?.split("#")[1];
  const referenceElementIndex = elements.findIndex(
    (element) => element.id === contentReference,
  );
  if (!referenceElementIndex)
    throw new Error(
      "unable to resolve contentreference: '" + element.contentReference + "'",
    );
  return descend(elementsLoc, referenceElementIndex) as unknown as ElementLoc;
}

type PropertyAndType = { field: string; type: uri };

function findBaseFieldAndType(
  element: ElementDefinition,
  value: object,
): PropertyAndType | undefined {
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

/**
 * Returns fields associated to an element. Because it could be a primitive it may result in multiple fields.
 * IE _field for Element values for field primitive value.
 *
 * @param element The ElementDefinition to find fields for
 * @param value Value to check for fields.
 * @returns
 */
function getFoundFieldsForElement(
  element: ElementDefinition,
  value: object,
): PropertyAndType[] {
  const properties: PropertyAndType[] = [];
  const base = findBaseFieldAndType(element, value);
  if (base) {
    properties.push(base);
    const { field, type } = base;
    if (isPrimitiveType(type)) {
      const primitiveElementField = {
        field: `_${field}`,
        type: "Element" as uri,
      };
      if (`_${field}` in value) properties.push(primitiveElementField);
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
        properties.push(primitiveElementField);
      }
    }
  }
  return properties;
}

function isElementRequired(element: ElementDefinition) {
  return (element.min ?? 0) > 0;
}

function isReferenceConformantToStructureDefinition(
  sd: Resource<FHIR_VERSION, "StructureDefinition">,
  value: Reference,
): boolean {
  switch (true) {
    case sd?.type === "Resource" || sd?.type === "DomainResource": {
      return true;
    }
    case value.reference !== undefined: {
      const resourceType = value.reference.split("/")[0];

      switch (true) {
        // Could be ref in bundle so skip for now.
        case !isResourceType(resourceType): {
          return true;
        }
        case resourceType === sd?.type: {
          // If Reference also has type need to validate that as well
          if (value.type) return resourceType === value.type;
          return true;
        }
        default: {
          return false;
        }
      }
    }
    case value.type && value === sd?.type: {
      return true;
    }
    case value.type === undefined && value.reference === undefined: {
      return true;
    }
    default: {
      return false;
    }
  }
}

/**
 * Validate the Reference is conformant to the profile (only confirms the type)
 * @param ctx ValidationCTX
 * @param element ElementDefinition to confirm Reference types
 * @param root
 * @param path
 * @returns
 */
async function validateReferenceTypeConstraint(
  ctx: ValidationCTX,
  element: ElementDefinition,
  root: object,
  path: Loc<object, any, any>,
): Promise<OperationOutcome["issue"]> {
  // [Note] because element should already be validated as reference this can be considered safe?
  const value = get(path, root) as Reference | undefined;
  if (!value) return [];

  const referenceProfiles = element.type?.find(
    (t) => t.code === "Reference",
  )?.targetProfile;
  if (referenceProfiles === undefined || referenceProfiles?.length === 0)
    return [];
  for (const profileURI of referenceProfiles ?? []) {
    const sd = await ctx.resolveCanonical(
      ctx.fhirVersion,
      "StructureDefinition",
      profileURI,
    );
    if (!sd) {
      throw new OperationError(
        outcomeFatal(
          "not-found",
          `Could not find profile: '${profileURI}' to validate reference`,
        ),
      );
    }
    if (isReferenceConformantToStructureDefinition(sd, value)) {
      return [];
    }
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
 * Validates the BackboneElement / Element values that have nested ElementDefinitions
 *
 * @param ctx
 * @param structureDefinition
 * @param elementLoc
 * @param root
 * @param path
 * @param childrenIndexes
 * @returns
 */
async function validateElementNested(
  ctx: ValidationCTX,
  structureDefinition: StructureDefinition | r4b.StructureDefinition,
  elementLoc: ElementLoc,
  root: object,
  path: Loc<object, any, any>,
  childrenIndexes: number[],
): Promise<OperationOutcome["issue"]> {
  const { field: elementIndex, parent: elementsLoc } =
    ascendElementLoc(elementLoc);
  // Found concatenate on found fields so can check at end whether their are additional and throw error.
  const foundFields: Set<string> =
    structureDefinition.kind === "resource" && elementIndex === 0
      ? new Set(["resourceType"])
      : new Set([]);

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
      childrenIndexes.map(async (childElementIndex) => {
        const childElementLoc = descend(
          elementsLoc,
          childElementIndex,
        ) as unknown as ElementLoc;
        const element = get(childElementLoc, structureDefinition);
        if (!notNullable(element)) {
          throw new OperationError(
            outcomeFatal(
              "structure",
              `Element not found at '${childElementLoc}' for StructureDefinition ${structureDefinition.id}`,
              [toJSONPointer(path)],
            ),
          );
        }

        // Because Primitives can be extended under seperate key we must check multiple fields.
        const fields = getFoundFieldsForElement(element, value);
        fields.forEach((f) => foundFields.add(f.field));

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
                structureDefinition,
                childElementLoc,
                root,
                descend(path, fieldType.field),
                fieldType.type,
              ),
            ),
          )
        ).flat();
      }),
    )
  ).flat();

  // Check for additional fields
  const additionalFields = new Set(Object.keys(value)).difference(foundFields);

  return additionalFields.size > 0
    ? [
        ...issues,
        issueError(
          "structure",
          `Additional fields found at path '${toJSONPointer(
            path,
          )}': '${Array.from(additionalFields).join(", ")}'`,
          [toJSONPointer(path)],
        ),
      ]
    : issues;
}

/**
 * Validates a singular element. This Could be a primitive or complex type.
 * @param ctx
 * @param structureDefinition
 * @param elementLoc The location to the ElementDefinition in the structure definition.
 * @param root
 * @param path
 * @param type
 * @returns
 */
export async function validateElementSingular(
  ctx: ValidationCTX,
  structureDefinition: StructureDefinition | r4b.StructureDefinition,
  elementLoc: ElementLoc,
  root: object,
  path: Loc<object, any, any>,
  type: uri,
): Promise<OperationOutcome["issue"]> {
  const { field: elementIndex, parent: elementsLoc } =
    ascendElementLoc(elementLoc);

  const element = get(elementLoc, structureDefinition);
  if (!element) {
    throw new OperationError(
      outcomeFatal("invalid", `Element not found at loc '${elementLoc}'`),
    );
  }

  if (element.contentReference) {
    return validateElementSingular(
      ctx,
      structureDefinition,
      resolveContentReferenceIndex(structureDefinition, elementsLoc, element),
      root,
      path,
      type,
    );
  }

  const childrenIndixes = eleIndexToChildIndexes(
    get(elementsLoc, structureDefinition as StructureDefinition) ?? [],
    elementIndex as number,
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
        return await validateReferenceTypeConstraint(ctx, element, root, path);
      }
      return issues;
    }
  } else {
    return validateElementNested(
      ctx,
      structureDefinition,
      elementLoc,
      root,
      path,
      childrenIndixes,
    );
  }
}

export async function validateElement(
  ctx: ValidationCTX,
  structureDefinition: Resource<FHIR_VERSION, "StructureDefinition">,
  elementLoc: ElementLoc,
  root: object,
  path: Loc<any, any, any>,
  type: uri,
): Promise<OperationOutcome["issue"]> {
  const element = get(elementLoc, structureDefinition);
  if (!notNullable(element)) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Element not found at '${elementLoc}' for StructureDefinition ${structureDefinition.id}`,
        [toJSONPointer(path)],
      ),
    );
  }

  const value = get(path, root);

  const issues = validateCardinality(element, elementLoc, root, path);
  if (issues.length > 0) return issues;

  switch (true) {
    // If min is zero than allow undefined.
    case value === undefined: {
      return [];
    }
    case Array.isArray(value): {
      return (
        await Promise.all(
          (value || []).map((_v: any, i: number) => {
            return validateElementSingular(
              ctx,
              structureDefinition,
              elementLoc,
              root,
              descend(path, i),
              type,
            );
          }),
        )
      ).flat();
    }
    default: {
      return validateElementSingular(
        ctx,
        structureDefinition,
        elementLoc,
        root,
        path,
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

  const sd = await resolveTypeToStructureDefinition(ctx, type);

  if (!isObject(root))
    return [
      issueError(
        "structure",
        `Value must be an object when validating '${type}'. Instead found type of '${typeof root}'`,
        [toJSONPointer(path)],
      ),
    ];

  if (sd.kind === "resource") {
    // Verify the resourceType aligns.
    if (get(descend(path, "resourceType"), root) !== type) {
      return [
        issueError(
          "invalid",
          `ResourceType '${
            (root as unknown as Resource<FHIR_VERSION, AllResourceTypes>)
              .resourceType
          }' does not match expected type '${type}'`,
          [toJSONPointer(path)],
        ),
      ];
    }
  }

  const startingLoc = descend(
    descend(
      descend(pointer("StructureDefinition", sd.id as id), "snapshot"),
      "element",
    ),
    0,
  );

  return validateElement(
    ctx,
    sd,
    startingLoc as unknown as ElementLoc,
    root,
    path,
    type,
  );
}
