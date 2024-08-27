/* eslint-disable @typescript-eslint/no-explicit-any */
import { FHIRRequest } from "@iguhealth/client/lib/types";
import * as pt from "@iguhealth/fhir-pointer";
import {
  AccessPolicyV2,
  AccessPolicyV2Rule,
  AccessPolicyV2RuleTarget,
  Expression,
  Membership,
  OperationOutcome,
  id,
} from "@iguhealth/fhir-types/r4/types";
import * as fp from "@iguhealth/fhirpath";
import { AccessTokenPayload } from "@iguhealth/jwt";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

type Role = "admin" | "owner" | "member";

export interface PolicyContext {
  user: { claims: AccessTokenPayload<Role>; membership: Membership };
  request: FHIRRequest;
}

const PERMISSION_LEVELS = {
  deny: <const>-1,
  undetermined: <const>0,
  permit: <const>1,
};

async function evaluateExpression(
  context: PolicyContext,
  loc: pt.Loc<AccessPolicyV2, Expression | undefined, any>,
  policy: AccessPolicyV2,
): Promise<boolean> {
  const expression = pt.get(loc, policy);
  if (!expression)
    throw new OperationError(
      outcomeFatal(
        "exception",
        `Invalid access policy expression at '${loc}'.`,
      ),
    );

  switch (expression.language) {
    case "text/fhirpath": {
      if (!expression.expression) {
        throw new OperationError(
          outcomeFatal(
            "exception",
            `Invalid access policy expression at '${loc}'.`,
          ),
        );
      }
      const result = await fp.evaluate(expression.expression, undefined, {
        variables: { policy, ...context },
      });

      if (result.length !== 1 || typeof result[0] !== "boolean") {
        throw new OperationError(
          outcomeFatal(
            "exception",
            `Invalid access policy expression at '${loc}'.`,
          ),
        );
      }

      return result[0];
    }
    default: {
      throw new OperationError(
        outcomeFatal(
          "exception",
          `Invalid access policy expression language '${expression.language}' at ${loc}.`,
        ),
      );
    }
  }
}

async function evaluateConditon(
  context: PolicyContext,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Rule | undefined, any>,
  policy: AccessPolicyV2,
): Promise<(typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS]> {
  const rule = pt.get(loc, policy);
  const effect: "permit" | "deny" =
  (rule?.effect as unknown as "permit" | "deny" | undefined) ?? "permit";
  const evaluation = await evaluateExpression(
    context,
    pt.descend(pt.descend(loc, "condition"), "expression"),
    policy,
  );
  return (evaluation ? PERMISSION_LEVELS[effect] : -(PERMISSION_LEVELS[effect])) as (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS];
}

async function shouldEvaluateRule(
  context: PolicyContext,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2RuleTarget | undefined, any>,
  policy: AccessPolicyV2): Promise<boolean> {
  const target = pt.get(loc, policy);
  if(target?.expression === undefined) return true;

  return evaluateExpression(context, pt.descend(loc, "expression"), policy);
}

async function evaluateAccessPolicyRule(
  context: PolicyContext,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Rule | undefined, any>,
  policy: AccessPolicyV2,
): Promise<{
  result: (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS],
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Rule | undefined, any>
}> {
  const rule = pt.get(loc, policy);
  if (!rule) {
    throw new OperationError(
      outcomeFatal("exception", `Invalid access policy rule at '${loc}'.`),
    );
  }
  if(await shouldEvaluateRule(context, pt.descend(loc, "target"), policy) === false) {
    return {
      result: PERMISSION_LEVELS.undetermined,
      loc
    };
  }

  switch (true) {
    case rule.condition !== undefined: {
      return { result: await evaluateConditon(context, loc, policy), loc }
    }
    case rule.rule !== undefined: {
      const behavior = rule.combineBehavior ?? "all";
      switch (behavior) {
        case "all": {
          for (let i = 0; i < (rule.rule ?? []).length; i++) {
            const childRuleLoc = pt.descend(pt.descend(loc, "rule"), i);
            const childResult = await evaluateAccessPolicyRule(context, childRuleLoc, policy)
            // Could be undetermined but skipping that like permit.
            if (
              childResult.result === PERMISSION_LEVELS.deny
            ) {
              return {
                result: PERMISSION_LEVELS.deny,
                loc: childResult.loc
              }
            }
          }
          return {
            result: PERMISSION_LEVELS.permit,
            loc
          };
        }
        case "any": {
          for (let i = 0; i < (rule.rule ?? []).length; i++) {
            const childRuleLoc = pt.descend(pt.descend(loc, "rule"), i);
            const childResult = await evaluateAccessPolicyRule(context, childRuleLoc, policy);
            if (
                childResult.result === PERMISSION_LEVELS.permit
            ) {
              return {
                result: PERMISSION_LEVELS.permit,
                loc: childResult.loc
              }
            }
          }
          return {
            result: PERMISSION_LEVELS.deny,
            loc
          };
        }
        default: {
          throw new OperationError(
            outcomeFatal("exception", "Invalid combine behavior."),
          );
        }
      }
    }
    default: {
      throw new OperationError(
        outcomeFatal("exception", "Invalid access policy rule."),
      );
    }
  }
}

/**
 * Evaluates a users access to request. If super admin bypasses accesspolicy evaluation.
 * Else access based on policies associated to a user.
 * @param ctx Server context.
 * @param request  The FHIR request being made.
 * @returns boolean as to whether or not a user is being granted access.
 */
export async function evaluate (
  context: PolicyContext,
  accessPolicy: AccessPolicyV2,
): Promise<OperationOutcome> {
  const loc = pt.pointer("AccessPolicyV2", accessPolicy.id as id);
  let result: (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS] = PERMISSION_LEVELS.deny;
  for (let i = 0; i < (accessPolicy.rule ?? []).length; i++) {
    const ruleLoc = pt.descend(pt.descend(loc, "rule"), i);
    const ruleResult = await evaluateAccessPolicyRule(context, ruleLoc, accessPolicy);
    if (ruleResult.result === PERMISSION_LEVELS.deny) {
      return outcomeError("forbidden", "Access Denied.", [pt.toJSONPointer(ruleResult.loc)]);
    }
    result = Math.max(result, ruleResult.result) as unknown as  (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS];
  }

  if(result === PERMISSION_LEVELS.permit) {
    return outcomeInfo("informational", "Access succeeded.");
  }

  return outcomeError("forbidden", "Access Denied.");
}
