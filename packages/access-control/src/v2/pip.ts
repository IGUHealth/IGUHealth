/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Policy Information Point
 * --------------------------------
 * Pull in contextual information to be used in policy evaluation
 * */

import { FHIRClient } from "@iguhealth/client/interface";
import { FHIRRequest } from "@iguhealth/client/types";
import { Loc } from "@iguhealth/fhir-pointer";
import {
  AccessPolicyV2,
  Expression,
  Membership,
} from "@iguhealth/fhir-types/r4/types";
import { AccessTokenPayload } from "@iguhealth/jwt";

export interface PolicyContext<Role> {
  variables: {
    [key: string]: unknown;
  };
  user: { claims: AccessTokenPayload<Role>; membership: Membership };
  request: FHIRRequest;
}

/**
 * Search AccessPolicy for variable location.
 * @param policy AccessPolicyV2 - policy to search for variable.
 */
function findVariable(
  policy: AccessPolicyV2,
): Loc<AccessPolicyV2, Expression, any> | undefined {
  return undefined;
}

export default function pip<CTX>(
  ctx: CTX,
  client: FHIRClient<CTX>,
  policy: AccessPolicyV2,
  variable: string,
) {}
