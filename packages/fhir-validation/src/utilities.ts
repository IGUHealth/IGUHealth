/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loc, ascend } from "@iguhealth/fhir-pointer";
import { primitiveTypes, resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  ElementDefinition,
  StructureDefinition,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { ElementLoc, ValidationCTX } from "./types.js";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isPrimitiveType(type: string) {
  return primitiveTypes.has(type);
}

export function notNullable<T, Z extends T | undefined>(
  value: Z,
): value is NonNullable<Z> {
  if (value === undefined || value === null) return false;
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

export async function resolveTypeToStructureDefinition(
  ctx: ValidationCTX,
  type: uri,
): Promise<Resource<FHIR_VERSION, "StructureDefinition">> {
  const canonical = await ctx.resolveTypeToCanonical(ctx.fhirVersion, type);

  if (!canonical) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Unable to resolve canonical for type '${type}'`,
        [],
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
      ),
    );

  return sd;
}

export function ascendElementLoc(loc: ElementLoc): {
  parent: Loc<StructureDefinition, ElementDefinition[]>;
  field: NonNullable<keyof ElementDefinition[]>;
} {
  const parent = ascend(loc);

  if (!parent) {
    throw new OperationError(
      outcomeFatal("invalid", `Invalid element path ${loc}`),
    );
  }

  return parent;
}
