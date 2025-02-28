/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Loc,
  descend,
  get,
  pointer,
  toJSONPointer,
} from "@iguhealth/fhir-pointer";
import {
  OperationOutcome,
  OperationOutcomeIssue,
  Reference,
  canonical,
  id,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import {
  AllDataTypes,
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import {
  ElementNode,
  MetaNode,
  TypeNode,
  getMeta,
  getStartingMeta,
} from "@iguhealth/meta-value/meta";
import {
  isObject,
  isPrimitiveType,
  isResourceType,
} from "@iguhealth/meta-value/utilities";
import {
  OperationError,
  issueError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { validatePrimitive } from "../elements/primitive.js";
import { validateCardinality } from "../elements/validators/cardinality.js";
import { validateFixedValue } from "../elements/validators/fixedValue.js";
import { validatePattern } from "../elements/validators/pattern.js";
import { ValidationCTX } from "../types.js";
import { isElementRequired } from "../utilities.js";

function isReferenceConformantToStructureDefinition(
  ctx: ValidationCTX,
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
        case !isResourceType(ctx.fhirVersion, resourceType as uri): {
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
  referenceProfiles: canonical[],
  root: object,
  path: Loc<object, any, any>,
): Promise<OperationOutcome["issue"]> {
  // [Note] because element should already be validated as reference this can be considered safe?
  const value = get(path, root) as Reference | undefined;
  if (!value) return [];

  if (referenceProfiles.length === 0) return [];

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
    if (isReferenceConformantToStructureDefinition(ctx, sd, value)) {
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

type PropertyAndType = { field: string; meta: MetaNode };

function checkPrimitive(
  version: FHIR_VERSION,
  property: string,
  meta: TypeNode,
  value: Record<string, unknown>,
): PropertyAndType[] {
  const properties = [];
  if (property in value) {
    properties.push({ field: property, meta });
  }
  if (`_${property}` in value) {
    properties.push({
      field: property,
      meta: getStartingMeta(version, "Element" as uri) as MetaNode,
    });
  }

  return properties;
}

function findMetaFields(
  version: FHIR_VERSION,
  parentMeta: ElementNode,
  property: string,
  value: unknown,
): PropertyAndType[] {
  const childMeta = getMeta(version, parentMeta, property);
  if (!childMeta) {
    throw new OperationError(
      outcomeFatal("invalid", `Could not find meta for property '${property}'`),
    );
  }

  if (!isObject(value)) return [];

  switch (childMeta._type_) {
    case "complex": {
      return [{ field: property, meta: childMeta }];
    }
    case "type": {
      if (isPrimitiveType(version, childMeta.type)) {
        return checkPrimitive(
          version,
          property,
          childMeta,
          value as Record<string, unknown>,
        );
      }
      return [{ field: property, meta: childMeta }];
    }
    case "typechoice": {
      for (const field in Object.keys(childMeta.fieldsToType)) {
        if (value[field] !== undefined) {
          return [
            {
              field,
              meta: getStartingMeta(
                version,
                childMeta.fieldsToType[field],
              ) as MetaNode,
            },
          ];
        }
      }
      return [];
    }
  }
}

/**
 * Validates the BackboneElement / Element values that have nested ElementDefinitions
 *
 * @param ctx
 * @param Meta
 * @param root
 * @param path
 * @param childrenIndexes
 * @returns
 */
async function validateComplex(
  ctx: ValidationCTX,
  meta: ElementNode,
  root: object,
  path: Loc<object, any, any>,
): Promise<OperationOutcome["issue"]> {
  // Found concatenate on found fields so can check at end whether their are additional and throw error.
  const foundFields: Set<string> = isResourceType(ctx.fhirVersion, meta.type)
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

  const issues = await Promise.all(
    Object.keys(meta.properties ?? {}).map(async (property) => {
      const fields = findMetaFields(ctx.fhirVersion, meta, property, value);
      fields.forEach((f) => foundFields.add(f.field));

      const childMeta = getMeta(ctx.fhirVersion, meta, property);
      if (!childMeta) {
        throw new OperationError(
          outcomeFatal(
            "invalid",
            `Could not find meta for property '${property}'`,
          ),
        );
      }

      if (isElementRequired(childMeta?.definition) && fields.length === 0) {
        return [
          issueError(
            "structure",
            `Missing required field at path '${toJSONPointer(path)}'`,
            [toJSONPointer(path)],
          ),
        ];
      }

      return (
        await Promise.all(
          fields.map((fieldType) =>
            validateElement(
              ctx,
              fieldType.meta,
              root,
              descend(path, fieldType.field),
            ),
          ),
        )
      ).flat();
    }),
  );

  // Check for additional fields
  const additionalFields = new Set(Object.keys(value)).difference(foundFields);

  return additionalFields.size > 0
    ? [
        ...issues.flat(),
        issueError(
          "structure",
          `Additional fields found at path '${toJSONPointer(
            path,
          )}': '${Array.from(additionalFields).join(", ")}'`,
          [toJSONPointer(path)],
        ),
      ]
    : issues.flat();
}

/**
 * Validates a singular element. This Could be a primitive or complex type.
 * @param ctx
 * @param meta Structural information.
 * @param root
 * @param path
 * @param type
 * @returns
 */
export async function validateElementSingular(
  ctx: ValidationCTX,
  meta: MetaNode,
  root: object,
  path: Loc<object, any, any>,
): Promise<OperationOutcome["issue"]> {
  if (meta._type_ === "fp-primitive") {
    throw new Error();
  }

  const patternIssues = await validatePattern(meta.definition, root, path);
  if (patternIssues.length > 0) {
    return patternIssues;
  }

  const fixedValueIssues = await validateFixedValue(
    meta.definition,
    root,
    path,
  );

  if (fixedValueIssues.length > 0) {
    return fixedValueIssues;
  }

  switch (meta._type_) {
    case "type": {
      if (meta.type === "Reference") {
        return validateReferenceTypeConstraint(
          ctx,
          meta.definition.type
            ?.filter((t) => t.code === "Reference")
            .map((t) => t.targetProfile ?? [])
            .flat() ?? [],
          root,
          path,
        );
      }
    }
    case "typechoice": {
      throw new Error();
    }
    case "complex": {
      return validateComplex(ctx, meta, root, path);
    }
  }

  if (
    isPrimitiveType(ctx.fhirVersion, meta.type) ||
    meta.type === "http://hl7.org/fhirpath/System.String"
  ) {
    return validatePrimitive(ctx, meta.definition, root, path, meta.type);
  }

  return validateComplex(ctx, meta, root, path);

  // Leaf validation
  if (childrenIndixes.length === 0) {
    if (
      isPrimitiveType(ctx.fhirVersion, type) ||
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
    return validateComplex(ctx, meta, root, path);
  }
}

export async function validateElement(
  ctx: ValidationCTX,
  meta: MetaNode,
  root: object,
  path: Loc<any, any, any>,
): Promise<OperationOutcomeIssue[]> {
  const value = get(path, root);

  const issues = validateCardinality(meta.definition, root, path);
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
            return validateElementSingular(ctx, meta, root, descend(path, i));
          }),
        )
      ).flat();
    }
    default: {
      return validateElementSingular(ctx, meta, root, path);
    }
  }
}

export function _validate(
  ctx: ValidationCTX,
  meta: ElementNode,
  root: unknown,
  path_?: Loc<any, any, any>,
) {
  const path =
    path_ ??
    pointer(ctx.fhirVersion, meta.type as AllResourceTypes, "id" as id);

  if (!isObject(root))
    return [
      issueError(
        "structure",
        `Value must be an object when validating '${meta.type}'. Instead found type of '${typeof root}'`,
        [toJSONPointer(path)],
      ),
    ];

  const resource = root as unknown as Resource<FHIR_VERSION, AllResourceTypes>;

  if (isResourceType(ctx.fhirVersion, meta.type)) {
    // Verify the resourceType aligns.
    if (get(descend(path, "resourceType"), resource) !== meta.type) {
      return [
        issueError(
          "invalid",
          `ResourceType '${
            resource.resourceType
          }' does not match expected type '${meta.type}'`,
          [toJSONPointer(path)],
        ),
      ];
    }
  }

  return validateElement(ctx, meta, resource, path);
}

export default async function validate(
  ctx: ValidationCTX,
  type: uri,
  root: unknown,
  path_?: Loc<any, any, any>,
): Promise<OperationOutcome["issue"]> {
  const path =
    path_ ?? pointer(ctx.fhirVersion, type as AllDataTypes, "id" as id);

  if (isPrimitiveType(ctx.fhirVersion, type))
    return validatePrimitive(ctx, undefined, root, path, type);

  const meta = getStartingMeta(ctx.fhirVersion, type);
  if (!meta) {
    throw new OperationError(
      outcomeFatal(
        "invalid",
        `Structural validation found an invalid type: '${type}'.`,
      ),
    );
  }

  return _validate(ctx, meta, root, path);
}
