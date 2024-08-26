/* eslint-disable @typescript-eslint/no-explicit-any */
import { FHIRRequest } from "@iguhealth/client/lib/types";
import * as pt from "@iguhealth/fhir-pointer";
import {
  AccessPolicyV2,
  AccessPolicyV2Rule,
  AccessPolicyV2RuleCondition,
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
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2RuleCondition | undefined, any>,
  policy: AccessPolicyV2,
): Promise<boolean> {
  const evaluation = await evaluateExpression(
    context,
    pt.descend(loc, "expression"),
    policy,
  );

  return evaluation;
}

async function evaluateAccessPolicyRule(
  context: PolicyContext,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Rule | undefined, any>,
  policy: AccessPolicyV2,
): Promise<boolean> {
  const rule = pt.get(loc, policy);
  if (!rule) {
    throw new OperationError(
      outcomeFatal("exception", `Invalid access policy rule at '${loc}'.`),
    );
  }

  switch (true) {
    case rule.condition !== undefined: {
      return evaluateConditon(context, pt.descend(loc, "condition"), policy);
    }
    case rule.rule !== undefined: {
      const behavior = rule.combineBehavior ?? "all";
      switch (behavior) {
        case "all": {
          for (let i = 0; i < (rule.rule ?? []).length; i++) {
            const childRuleLoc = pt.descend(pt.descend(loc, "rule"), i);
            if (
              !(await evaluateAccessPolicyRule(context, childRuleLoc, policy))
            ) {
              return false;
            }
          }
          return true;
        }
        case "any": {
          for (let i = 0; i < (rule.rule ?? []).length; i++) {
            const childRuleLoc = pt.descend(pt.descend(loc, "rule"), i);
            if (
              !(await evaluateAccessPolicyRule(context, childRuleLoc, policy))
            ) {
              return true;
            }
          }
          return false;
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
export default async function (
  context: PolicyContext,
  accessPolicy: AccessPolicyV2,
): Promise<OperationOutcome> {
  const loc = pt.pointer("AccessPolicyV2", accessPolicy.id as id);
  for (let i = 0; i < (accessPolicy.rule ?? []).length; i++) {
    const ruleLoc = pt.descend(pt.descend(loc, "rule"), i);
    if (!(await evaluateAccessPolicyRule(context, ruleLoc, accessPolicy))) {
      return outcomeError("forbidden", "Access Denied.");
    }
  }

  return outcomeInfo("informational", "Access succeeded.");
}
