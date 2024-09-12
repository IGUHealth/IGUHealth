/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Policy Information Point
 * --------------------------------
 * Pull in contextual information to be used in policy evaluation
 * */

import { FHIRClient, FHIRClientAsync } from "@iguhealth/client/interface";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/types";
import * as pt from "@iguhealth/fhir-pointer";
import {
  AccessPolicyV2,
  AccessPolicyV2Attribute,
  ClientApplication,
  Expression,
  Membership,
  OperationDefinition,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import * as fp from "@iguhealth/fhirpath";
import { AccessTokenPayload } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export interface PolicyContext<CTX, Role> {
  clientCTX: CTX;
  client: FHIRClientAsync<CTX>;
  environment: {
    request: FHIRRequest;
    user: {
      payload: AccessTokenPayload<Role>;
      resource: Membership | ClientApplication | OperationDefinition;
    };
  };
  attributes: {
    [key: string]: FHIRResponse;
  };
}

/**
 * Search AccessPolicy for variable location.
 * @param policy AccessPolicyV2 - policy to search for variable.
 */
function findVariable(
  policy: AccessPolicyV2,
  variable: id,
):
  | pt.Loc<AccessPolicyV2, AccessPolicyV2Attribute | undefined, any>
  | undefined {
  const pointer = pt.descend(
    pt.pointer("AccessPolicyV2", policy.id as id),
    "attribute",
  );
  for (let i = 0; i < (policy.attribute ?? []).length; i++) {
    if (policy.attribute?.[i]?.attributeId === variable) {
      return pt.descend(pointer, i);
    }
  }
  return undefined;
}

async function evaluateExpression<CTX, Role>(
  policyContext: PolicyContext<CTX, Role>,
  policy: AccessPolicyV2,
  loc: pt.Loc<AccessPolicyV2, Expression, any>,
): Promise<NonNullable<unknown>[]> {
  const expression = pt.get(loc, policy);
  if (!expression) {
    throw new OperationError(
      outcomeError(
        "exception",
        `Invalid access policy expression at '${loc}'.`,
      ),
    );
  }

  switch (expression.language) {
    case "text/fhirpath": {
      if (!expression.expression) {
        throw new OperationError(
          outcomeError(
            "exception",
            `Invalid access policy expression at '${loc}'.`,
          ),
        );
      }
      const result = await fp.evaluate(expression.expression, undefined, {
        variables: policyContext.environment,
      });

      return result;
    }
    default: {
      throw new OperationError(
        outcomeError(
          "exception",
          `Invalid access policy expression at '${loc}'.`,
        ),
      );
    }
  }
}

async function processAttribute<CTX>(
  clientContext: CTX,
  client: FHIRClient<CTX>,
  policy: AccessPolicyV2,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Attribute | undefined, any>,
): Promise<FHIRResponse> {
  const attribute = pt.get(loc, policy);
  if (!attribute) {
    throw new Error("Attribute not found on loc.");
  }

  switch (true) {
    case attribute.operation !== undefined: {
      switch (attribute.operation.type) {
        case "read": {
          return client.request(clientContext, {
            fhirVersion: R4,
            level: "instance",
            type: "read-request",
            resource: "Patient",
            id: "123" as id,
          });
        }

        case "search-system": {
          return client.request(clientContext, {
            fhirVersion: R4,
            level: "system",
            type: "search-request",
            parameters: [],
          });
        }

        case "search-type": {
          return client.request(clientContext, {
            fhirVersion: R4,
            level: "type",
            type: "search-request",
            resource: "Patient",
            parameters: [],
          });
        }
        default: {
          throw new OperationError(
            outcomeError(
              "exception",
              `Invalid access policy attribute operation at '${loc}'.`,
            ),
          );
        }
      }
    }
    default: {
      throw new OperationError(
        outcomeError(
          "exception",
          `Invalid access policy attribute at '${loc}'.`,
        ),
      );
    }
  }
}

type PiPResult<CTX, Role> = {
  context: PolicyContext<CTX, Role>;
  attribute:
    | FHIRRequest
    | {
        payload: AccessTokenPayload<Role>;
        resource: OperationDefinition | ClientApplication | Membership;
      }
    | FHIRResponse;
};

async function retrieveAttribute<CTX, Role>(
  policyContext: PolicyContext<CTX, Role>,
  policy: AccessPolicyV2,
  loc: pt.Loc<AccessPolicyV2, AccessPolicyV2Attribute | undefined, any>,
): Promise<PiPResult<CTX, Role>> {
  const attribute = pt.get(loc, policy);
  if (!attribute) {
    throw new Error("Attribute not found on loc.");
  }

  if (!policyContext.attributes[attribute.attributeId]) {
    const result = await processAttribute(
      policyContext.clientCTX,
      policyContext.client,
      policy,
      loc,
    );
    policyContext.attributes[attribute.attributeId] = result;
  }

  return {
    context: policyContext,
    attribute: policyContext.attributes[attribute.attributeId],
  };
}

export default async function pip<Role, CTX>(
  policyContext: PolicyContext<CTX, Role>,
  policy: AccessPolicyV2,
  variable: id,
): Promise<PiPResult<CTX, Role>> {
  switch (true) {
    case variable in policyContext.environment: {
      const value =
        policyContext.environment[
          variable as keyof typeof policyContext.environment
        ];
      return {
        context: policyContext,
        attribute: value,
      };
    }
    default: {
      const loc = findVariable(policy, variable);
      if (!loc) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `Variable with id '${variable}' was not found`,
          ),
        );
      }

      return retrieveAttribute(policyContext, policy, loc);
    }
  }
}
