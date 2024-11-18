/**
 * Policy Decision Point
 * --------------------------------
 * Evaluate the policy against the context and return a decision.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as pt from "@iguhealth/fhir-pointer";
import {
  AccessPolicyV2,
  AccessPolicyV2Rule,
  AccessPolicyV2RuleTarget,
  OperationOutcome,
  id,
} from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import pip from "./pip.js";
import { PolicyContext, Result } from "../types.js";
import { evaluateExpression } from "./utilities.js";
import { R4 } from "@iguhealth/fhir-types/versions";

const PERMISSION_LEVELS = {
  deny: <const>-1,
  undetermined: <const>0,
  permit: <const>1,
};

const resolveVariable = async <CTX, Role, Context extends PolicyContext<CTX, Role>>(
  context: Context,
  policy: AccessPolicyV2,
  variableId: id,
) => {
  const res = await pip(context, policy, variableId);
  return {
    context: res.context as Context,
    value: res.attribute,
  };
};

async function evaluateConditon<CTX, Role>(
  context: PolicyContext<CTX, Role>,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Rule | undefined, any>,
  policy: AccessPolicyV2,
): Promise<
  Result<CTX, Role, (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS]>
> {
  const rule = pt.get(loc, policy);
  const effect: "permit" | "deny" =
    (rule?.effect as unknown as "permit" | "deny" | undefined) ?? "permit";

  const evaluation = await evaluateExpression(
    context,
    policy,
    pt.descend(pt.descend(loc, "condition"), "expression"),
    resolveVariable
  );

  return {
    context: evaluation.context,
    result:
      evaluation.result === true
        ? PERMISSION_LEVELS[effect]
        : (-PERMISSION_LEVELS[
            effect
          ] as (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS]),
  };
}

async function shouldEvaluateRule<CTX, Role>(
  policyContext: PolicyContext<CTX, Role>,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2RuleTarget | undefined, any>,
  policy: AccessPolicyV2,
): Promise<Result<CTX, Role, boolean>> {
  const target = pt.get(loc, policy);
  if (target?.expression === undefined)
    return { context: policyContext, result: true };

  const res =  await evaluateExpression(
    policyContext,    
    policy,
    pt.descend(loc, "expression"),
    resolveVariable
  );
  if(typeof res.result !== "boolean"){
    throw new OperationError(
      outcomeFatal("exception", `Invalid access policy target at '${loc}'.`),
    );
  }

  return res as Result<CTX, Role, boolean>
}

async function evaluateAccessPolicyRule<CTX, Role>(
  policyContext: PolicyContext<CTX, Role>,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Rule | undefined, any>,
  policy: AccessPolicyV2,
): Promise<
  Result<
    CTX,
    Role,
    (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS]
  > & { loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Rule | undefined, any> }
> {
  let context = policyContext;
  const rule = pt.get(loc, policy);
  if (!rule) {
    throw new OperationError(
      outcomeFatal("exception", `Invalid access policy rule at '${loc}'.`),
    );
  }
  const shouldEvaluate = await shouldEvaluateRule(
    context,
    pt.descend(loc, "target"),
    policy,
  );

  context = shouldEvaluate.context;

  if (shouldEvaluate.result !== true) {
    return {
      context,
      result: PERMISSION_LEVELS.undetermined,
      loc,
    };
  }

  switch (true) {
    case rule.condition !== undefined: {
      return {
        ...(await evaluateConditon(policyContext, loc, policy)),
        loc,
      };
    }
    case rule.rule !== undefined: {
      const behavior = rule.combineBehavior ?? "all";
      switch (behavior) {
        case "all": {
          let context = policyContext;
          for (let i = 0; i < (rule.rule ?? []).length; i++) {
            const childRuleLoc = pt.descend(pt.descend(loc, "rule"), i);
            const childResult = await evaluateAccessPolicyRule(
              context,
              childRuleLoc,
              policy,
            );
            context = childResult.context;
            // Could be undetermined but skipping that like permit.
            if (childResult.result === PERMISSION_LEVELS.deny) {
              return {
                context,
                result: PERMISSION_LEVELS.deny,
                loc: childResult.loc,
              };
            }
          }
          return {
            context,
            result: PERMISSION_LEVELS.permit,
            loc,
          };
        }
        case "any": {
          let context = policyContext;
          for (let i = 0; i < (rule.rule ?? []).length; i++) {
            const childRuleLoc = pt.descend(pt.descend(loc, "rule"), i);
            const childResult = await evaluateAccessPolicyRule(
              context,
              childRuleLoc,
              policy,
            );
            context = childResult.context;
            if (childResult.result === PERMISSION_LEVELS.permit) {
              return {
                context,
                result: PERMISSION_LEVELS.permit,
                loc: childResult.loc,
              };
            }
          }
          return {
            context,
            result: PERMISSION_LEVELS.deny,
            loc,
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
 * Evaluates a users access to request. If super admin bypasses accesspolicyv2 evaluation.
 * Else access based on policies associated to a user.
 * @param ctx Server context.
 * @param request  The FHIR request being made.
 * @returns boolean as to whether or not a user is being granted access.
 */
export async function evaluate<CTX, Role>(
  policyContext: PolicyContext<CTX, Role>,
  accessPolicy: AccessPolicyV2,
): Promise<OperationOutcome> {
  const loc = pt.pointer(R4, "AccessPolicyV2", accessPolicy.id as id);
  let result: (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS] =
    PERMISSION_LEVELS.deny;
  let context = policyContext;
  for (let i = 0; i < (accessPolicy.rule ?? []).length; i++) {
    const ruleLoc = pt.descend(pt.descend(loc, "rule"), i);
    const ruleResult = await evaluateAccessPolicyRule(
      context,
      ruleLoc,
      accessPolicy,
    );
    if (ruleResult.result === PERMISSION_LEVELS.deny) {
      return outcomeError("forbidden", "Access Denied.", [
        pt.toJSONPointer(ruleResult.loc),
      ]);
    }
    context = ruleResult.context;
    result = Math.max(
      result,
      ruleResult.result,
    ) as unknown as (typeof PERMISSION_LEVELS)[keyof typeof PERMISSION_LEVELS];
  }

  if (result === PERMISSION_LEVELS.permit) {
    return outcomeInfo("informational", "Access succeeded.");
  }

  return outcomeError("forbidden", "Access Denied.");
}
