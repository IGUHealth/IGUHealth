/**
 * Policy Information Point
 * --------------------------------
 * Pull in contextual information to be used in policy evaluation
 * */

import { FHIRRequest } from "@iguhealth/client/lib/types";
import {
  AccessPolicyV2,
  Membership,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { AccessTokenPayload } from "@iguhealth/jwt";

export interface PolicyContext<Role> {
  variables: {
    [key: string]: unknown;
  };
  user: { claims: AccessTokenPayload<Role>; membership: Membership };
  request: FHIRRequest;
}

export default function pip(AccessPolicy: AccessPolicyV2) {}
