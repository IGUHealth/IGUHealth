import { FHIRRequest } from "@iguhealth/client/lib/types";
import {
  AccessPolicyV2,
  Membership,
  OperationOutcome,
} from "@iguhealth/fhir-types/r4/types";
import { AccessTokenPayload } from "@iguhealth/jwt";
import { outcomeInfo } from "@iguhealth/operation-outcomes";

type Role = "admin" | "owner" | "member";

function evaluateAccessPolicyRule() {}

/**
 * Evaluates a users access to request. If super admin bypasses accesspolicy evaluation.
 * Else access based on policies associated to a user.
 * @param ctx Server context.
 * @param request  The FHIR request being made.
 * @returns boolean as to whether or not a user is being granted access.
 */
export default async function (
  context: {
    user: { claims: AccessTokenPayload<Role>; membership: Membership };
    request: FHIRRequest;
  },
  accessPolicy: AccessPolicyV2,
): Promise<OperationOutcome> {
  for (const rule of accessPolicy.rule ?? []) {
    console.log(rule);
  }

  return outcomeInfo("informational", "Access succeeded.");
}
