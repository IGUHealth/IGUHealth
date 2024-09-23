import {
  AccessPolicyV2,
  OperationOutcome,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import * as fullAccessEngine from "./engine/full-access/index.js";
import * as ruleEngine from "./engine/rule-engine/index.js";
import { PolicyContext } from "./engine/types.js";

export default function evaluatePolicy<CTX, Role>(
  policyContext: PolicyContext<CTX, Role>,
  policy: AccessPolicyV2,
): Promise<OperationOutcome> {
  switch (policy.engine) {
    case "rule-engine": {
      return ruleEngine.pdp.evaluate(policyContext, policy);
    }
    case "full-access": {
      return fullAccessEngine.evaluate(policyContext, policy);
    }
    default: {
      throw new OperationError(
        outcomeFatal(
          "exception",
          `Unknown engine found for policy ${policy.engine}.`,
        ),
      );
    }
  }
}
