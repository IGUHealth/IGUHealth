import { expect, test } from "@jest/globals";

import { FHIRRequest } from "@iguhealth/client/lib/types";
import {
  AccessPolicy,
  Patient,
  code,
  id,
} from "@iguhealth/fhir-types/lib/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { testServices } from "../../fhir-storage/providers/test-ctx";
import { FHIRServerCTX } from "../../fhir/context";
import { createAuthorizationMiddleWare } from "./authorization";

const authorizationMiddleware = createAuthorizationMiddleWare();

test("Authorization test for read access on resource based on type and method", async () => {
  const ctx: FHIRServerCTX = {
    ...testServices,
    tenant: testServices.tenant,

    user: {
      ...testServices.user,
      role: "USER",
      accessPolicies: [
        {
          resourceType: "AccessPolicy",
          type: "fhir-rest" as code,
          name: "test-policy",
          code: "test-policy" as code,
          access: [
            {
              fhir: {
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
    context,
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
        responder,
      )
    ).response,
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
        responder,
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
