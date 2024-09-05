/**
 * Policy Information Point
 * --------------------------------
 * Pull in contextual information to be used in policy evaluation
 * */

import { FHIRClient } from "@iguhealth/client/interface";
import { FHIRRequest } from "@iguhealth/client/types";
import { AccessPolicyV2, Membership } from "@iguhealth/fhir-types/r4/types";
import { AccessTokenPayload } from "@iguhealth/jwt";

export interface PolicyContext<Role> {
  variables: {
    [key: string]: unknown;
  };
  user: { claims: AccessTokenPayload<Role>; membership: Membership };
  request: FHIRRequest;
}

export default function pip<CTX>(
  ctx: CTX,
  client: FHIRClient<CTX>,
  AccessPolicy: AccessPolicyV2,
) {}
