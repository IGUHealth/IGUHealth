import {
  AccessPolicyV2,
  OperationOutcome,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  OperationError,
  outcomeFatal,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import { PolicyContext } from "../types.js";

export async function evaluate<CTX, Role>(
  _policyContext: PolicyContext<CTX, Role>,
  accessPolicy: AccessPolicyV2,
): Promise<OperationOutcome> {
  if (accessPolicy.engine !== "full-access") {
    throw new OperationError(
      outcomeFatal("exception", "Invalid engine for full access policy."),
    );
  }

  return outcomeInfo("informational", "Access succeeded.");
}
