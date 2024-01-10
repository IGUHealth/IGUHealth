import { expect, test } from "@jest/globals";

import { AccessPolicy, Patient, id } from "@iguhealth/fhir-types/lib/r4/types";
import { FHIRRequest } from "@iguhealth/client/lib/types";

import { testServices } from "../../resourceProviders/test-ctx";
import { FHIRServerCTX } from "../../fhir/context";
import { createAuthorizationMiddleWare } from "./authorization";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

const authorizationMiddleware = createAuthorizationMiddleWare();

test("Authorization test for read access on resource based on type and method", async () => {
  const ctx: FHIRServerCTX = {
    ...testServices,
    tenant: {
      ...testServices.tenant,
      userRole: "USER",
    },
    user: {
      ...testServices.user,
      accessPolicies: [
        {
          resourceType: "AccessPolicy",
          access: [
            {
              fhir: {
                level: "type",
                method: "read",
                resourceType: ["Patient"],
              },
            },
          ],
        } as AccessPolicy,
      ],
    },
  };

  const responder: ReturnType<typeof createAuthorizationMiddleWare> = async (
    context
  ) => {
    return {
      ...context,
      response: {
        type: "read-response",
        level: "instance",
        resourceType: "Patient",
        id: "1" as id,
        body: {
          resourceType: "Patient",
          id: "1",
        } as Patient,
      },
    };
  };

  expect(
    (
      await authorizationMiddleware(
        {
          ctx: ctx,
          state: {},
          request: {
            type: "read-request",
            level: "instance",
            resourceType: "Patient",
            id: "1",
          } as FHIRRequest,
        },
        responder
      )
    ).response
  ).toEqual({
    type: "read-response",
    level: "instance",
    resourceType: "Patient",
    id: "1" as id,
    body: {
      resourceType: "Patient",
      id: "1",
    } as Patient,
  });

  expect(async () => {
    try {
      await authorizationMiddleware(
        {
          ctx: ctx,
          state: {},
          request: {
            type: "search-request",
            level: "type",
            resourceType: "Patient",
          } as FHIRRequest,
        },
        responder
      );
    } catch (e) {
      // @ts-ignore
      throw e.operationOutcome;
    }
  }).rejects.toEqual({
    issue: [
      {
        code: "security",
        diagnostics: "access-denied",
        expression: undefined,
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });
});
