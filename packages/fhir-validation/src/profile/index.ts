/* eslint-disable @typescript-eslint/no-explicit-any */

import { eleIndexToChildIndices } from "@iguhealth/codegen/traversal/structure-definition";
import {
  Loc,
  descend,
  pointer,
  toJSONPointer,
  typedPointer,
} from "@iguhealth/fhir-pointer";
import {
  OperationOutcome,
  OperationOutcomeIssue,
  canonical,
  id,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";
import { IMetaValue } from "@iguhealth/meta-value/interface";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { ElementLoc, ValidationCTX } from "../types.js";
import validateAllSlicesAtLocation from "./slicing/index.js";

async function validateProfileElement(
  ctx: ValidationCTX,
  profile: Resource<FHIR_VERSION, "StructureDefinition">,
  elementLoc: ElementLoc,
  root: object,
  path: Loc<any, any, any>,
  type: uri,
): Promise<OperationOutcomeIssue[]> {
  // For Profiling validate changes in the cardinality and slices.
  // No need to validate the nested type only at the top level (because structural would have already confirmed this).
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
