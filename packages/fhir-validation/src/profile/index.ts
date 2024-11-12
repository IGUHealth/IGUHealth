/* eslint-disable @typescript-eslint/no-explicit-any */

import { eleIndexToChildIndices } from "@iguhealth/codegen/traversal/structure-definition";
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
  OperationOutcomeIssue,
  StructureDefinition,
  canonical,
  id,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";
import { IMetaValue } from "@iguhealth/meta-value/interface";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { ElementLoc, ValidationCTX } from "../types.js";
import { ascendElementLoc } from "../utilities.js";
import validateAllSlicesAtLocation from "./slicing/index.js";


/**
 * For descendants we want to ignore those slices which are validated seperately.
 * This is done by filtering off sliceName and slicing property.
 * 
 * @param elements list of ElementDefinitions to filter
 * @param indices The indices to filter out of the list if they are a part of a lice.
 * @returns Indices that are not a part of a slice.
 */
function ignoreSliceElements(elements: ElementDefinition[], indices: number[]): number[]{
  return indices.filter((index) => {
    const element = elements[index];
    return element.sliceName === undefined && element.slicing === undefined;
  });
}

/**
 * Because profile is merely a constraint on the base we only need to validate select pieces.
 *
 * [ALLOWED]:
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Restricting the cardinality of the element; e.g. the base might allow 0..*, and a particular application might support 1..2
 * Ruling out use of an element by setting its maximum cardinality to 0
 * Restricting the contents of an element to a single fixed value
 * Making additional constraints on the content of nested elements within the resource (expressed as FHIRPath statements)
 * Restricting the types for an element that allows multiple types
 * Requiring a typed element or the target of a resource reference to conform to another structure profile (declared in the same profile, or elsewhere)
 * Specifying a binding to a different terminology value set (see below)
 * Providing refined definitions, comments/usage notes and examples for the elements defined in a Resource to reflect the usage of the element within the context of the Profile
 * Providing more specific or additional mappings (e.g. to HL7 V2 icon or HL7 v3 icon) for the resource when used in a particular context
 * Declaring that one or more elements in the structure must be 'supported' (see below)
 * Restricting / clarifying a mapping by providing a new mapping with the same identity, which means that the new mapping replaces a mapping with the same identity in the element being profiled
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * [DISSALLOWED]:
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Profiles cannot break the rules established in the base specification (e.g. cardinality as described above)
 * Profiles cannot specify default values or meanings for elements defined in the base specification (note that datatypes and resources do not
 *   define default values at all, but default values may be defined for logical models
 * Profiles cannot change the name of elements defined in the base specification, or add new elements
 * It must be safe to process a resource without knowing the profile
 * --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * @param ctx Validation CTX
 * @param profile Profile SD
 * @param elementLoc Current ElementDefinition validating
 * @param root Root value to be validated
 * @param path Path inside of value to validate
 * @param type
 * @returns
 */
async function validateProfileElement(
  ctx: ValidationCTX,
  profile: Resource<FHIR_VERSION, "StructureDefinition">,
  elementLoc: ElementLoc,
  root: object,
  path: Loc<any, any, any>,
  type: uri,
): Promise<OperationOutcomeIssue[]> {
  const { parent: elementsLoc, field: elementIndex } =
    ascendElementLoc(elementLoc);

  const elements = get(elementsLoc, profile as StructureDefinition);
  const children = eleIndexToChildIndices(elements, elementIndex as number);

  const validateAllSlicesAtLocation()

  return [];
}

/**
 *
 * @param ctx_ Validation CTX
 * @param profileURL Profile canonical to validate
 * @param value the value to check
 * @param path The current path of the value.
 */
export default async function (
  ctx: ValidationCTX,
  profileURL: canonical,
  root: IMetaValue<unknown>,
  path: Loc<any, any, any> = typedPointer<any, any>(),
): Promise<OperationOutcomeIssue[]> {
  const profile = await ctx.resolveCanonical(
    ctx.fhirVersion,
    "StructureDefinition",
    profileURL,
  );
  if (!profile) {
    throw new OperationError(
      outcomeFatal(
        "not-found",
        `Unable to resolve canonical for profile '${profileURL}'`,
        [toJSONPointer(path)],
      ),
    );
  }
  if (profile.derivation !== "constraint") {
    throw new OperationError(
      outcomeFatal(
        "invalid",
        `Profile must be a constraint profile, got ${profile.derivation}`,
        [toJSONPointer(path)],
      ),
    );
  }

  const issues: OperationOutcomeIssue[] = [];

  const startingLoc = descend(
    descend(
      descend(pointer("StructureDefinition", profile.id as id), "snapshot"),
      "element",
    ),
    0,
  );

  return validateProfileElement(
    ctx,
    profile,
    startingLoc as unknown as ElementLoc,
    root,
    path,
    profile.type,
  );
}
