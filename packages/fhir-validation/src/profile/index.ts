/* eslint-disable @typescript-eslint/no-explicit-any */

import { eleIndexToChildIndices } from "@iguhealth/codegen/traversal/structure-definition";
import { Loc, toJSONPointer, typedPointer } from "@iguhealth/fhir-pointer";
import {
  OperationOutcome,
  StructureDefinition,
  canonical,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";
import { IMetaValue } from "@iguhealth/meta-value/interface";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import validateAllSlicesAtLocation from "../slicing/index.js";
import { ValidationCTX } from "../types.js";

function getNonSliceChildren(
  profile: Resource<FHIR_VERSION, "StructureDefinition">,
  differentialIndex: number,
): number[] {
  const differential = profile.differential?.element ?? [];
  const childrenIndices = eleIndexToChildIndices(
    differential,
    differentialIndex,
  );

  return childrenIndices.filter((childIndex) => {
    const element = differential[childIndex];
    // Filter out children with slices which are validated seperately.
    return element.slicing === undefined && element.sliceName === undefined;
  });
}

async function validateDifferential(
  ctx: ValidationCTX,
  profile: StructureDefinition | r4b.StructureDefinition,
  elementIndex: number,
  root: object,
  path: Loc<any, any, any>,
) {
  let issues = await validateAllSlicesAtLocation(
    ctx,
    profile,
    elementIndex,
    root,
    path,
  );

  const childrenIndices = getNonSliceChildren(profile, elementIndex);
  issues = issues.concat(
    (
      await Promise.all(
        childrenIndices.map((childIndex) =>
          validateDifferential(ctx, profile, childIndex, root, path),
        ),
      )
    ).flat(),
  );

  return issues;
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
  value: IMetaValue<unknown>,
  path: Loc<any, any, any> = typedPointer<any, any>(),
): Promise<OperationOutcome> {
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

  throw new Error();
}
