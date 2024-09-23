import {
  AccessPolicyV2,
  OperationOutcome,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  OperationError,
  issueError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import * as fullAccessEngine from "./engine/full-access/index.js";
import * as ruleEngine from "./engine/rule-engine/index.js";
import { PolicyContext } from "./engine/types.js";

export function evaluatePolicy<CTX, Role>(
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

/**
 * Determine whether the outcome is allowing permission or not based on the severity of the issues.
 * @param outcome OperationOutcome from evaluatePolicy || evaluatePolicies this function determines based on issue severity if the operation is permitted.
 * @returns boolean representing whether the operation is permitted.
 */
export function isPermitted(outcome: OperationOutcome): boolean {
  return (
    outcome.issue.find(
      (v) => v.severity === "error" || v.severity === "fatal",
      // Enforce that the outcome has at least one issue. This must be non error and non fatal.
    ) === undefined && outcome.issue.length > 0
  );
}

export default async function evaluatePolicies<CTX, Role>(
  policyContext: PolicyContext<CTX, Role>,
  policies: AccessPolicyV2[],
): Promise<OperationOutcome> {
  let issues: OperationOutcome["issue"] = [];
  for (const accessPolicy of policies ?? []) {
    const result = await evaluatePolicy(policyContext, accessPolicy);
    if (isPermitted(result)) {
      return result;
    }

    issues = issues.concat(
      result.issue.map((issue) => ({
        ...issue,
        extension: [
          {
            url: "https://iguhealth.app/AccessPolicy/policy-extension" as id,
            valueReference: { reference: `AccessPolicyV2/${accessPolicy.id}` },
          },
        ],
      })),
    );
  }

  return {
    resourceType: "OperationOutcome",
    issue: [
      issueError("forbidden", "No policy has granted access to your request"),
      ...issues,
    ],
  };
}
