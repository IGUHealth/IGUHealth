/* eslint-disable @typescript-eslint/no-explicit-any */

import * as pt from "@iguhealth/fhir-pointer";
import { AccessPolicyV2, Expression, id } from "@iguhealth/fhir-types/r4/types";
import * as fp from "@iguhealth/fhirpath";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { PolicyContext, Result } from "./types.js";

export async function evaluateExpression<CTX, Role>(
  policyContext: PolicyContext<CTX, Role>,
  policy: AccessPolicyV2,
  loc: pt.Loc<AccessPolicyV2, Expression | undefined, any>,
  resolveVariable: <Context extends PolicyContext<CTX, Role>>(
    context: Context,
    policy: AccessPolicyV2,
    variableId: id,
  ) => Promise<{ context: Context; value: unknown }>,
): Promise<Result<CTX, Role, unknown[]>> {
  let nextPolicyContext = policyContext;
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
        variables: async (variableId) => {
          const res = await resolveVariable(
            nextPolicyContext,
            policy,
            variableId as id,
          );
          nextPolicyContext = res.context;
          return res.value;
        },
      });

      if (result.length !== 1 || typeof result[0] !== "boolean") {
        throw new OperationError(
          outcomeFatal(
            "exception",
            `Invalid access policy expression at '${loc}'.`,
          ),
        );
      }

      return { context: nextPolicyContext, result };
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
