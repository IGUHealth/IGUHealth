import { expect, test } from "@jest/globals";

import { FHIRRequest, FHIRResponse } from "@iguhealth/client/lib/types";
import {
  AccessPolicy,
  Patient,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";
import { testServices } from "../../fhir-storage/test-ctx.js";
import createAuthorizationMiddleware from "./authorization.js";

const authorizationMiddleware = createAuthorizationMiddleware();

test("Authorization test for read access on resource based on type and method", async () => {
  const ctx: IGUHealthServerCTX = {
    ...testServices,
    tenant: testServices.tenant,
    user: {
      ...testServices.user,
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

  const responder: ReturnType<typeof createAuthorizationMiddleware> = async (
    context,
  ) => {
    return {
      ...context,
      response: {
        fhirVersion: context.request.fhirVersion,
        type: "read-response",
        level: "instance",
        resourceType: "Patient",
        id: "1" as id,
        body: {
          resourceType: "Patient",
          id: "1",
        } as Patient,
      } as FHIRResponse,
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
        severity: "error",
        code: "forbidden",
        diagnostics: "access-denied",
        expression: undefined,
      },
    ],
    resourceType: "OperationOutcome",
  });
});
