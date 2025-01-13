import { expect, test } from "@jest/globals";

import { FHIRRequest, FHIRResponse } from "@iguhealth/client/lib/types";
import {
  AccessPolicyV2,
  Patient,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { testServices } from "../../storage/test-ctx.js";
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
          id: "test-policy" as id,
          resourceType: "AccessPolicyV2",
          engine: "rule-engine" as code,
          name: "test-policy",
          code: "test-policy" as code,
          rule: [
            {
              name: "test-rule",
              target: {
                expression: {
                  expression: "true",
                  language: "text/fhirpath" as code,
                },
              },
              condition: {
                expression: {
                  expression: "%request.type = 'read-request'",
                  language: "text/fhirpath" as code,
                },
              },
            },
          ],
        } as AccessPolicyV2,
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
        resource: "Patient",
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
            resource: "Patient",
            id: "1",
          } as FHIRRequest,
        },
        responder,
      )
    ).response,
  ).toEqual({
    type: "read-response",
    level: "instance",
    resource: "Patient",
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
            resource: "Patient",
          } as FHIRRequest,
        },
        responder,
      );
    } catch (e) {
      // @ts-ignore
      throw e.operationOutcome;
    }
  }).rejects.toMatchSnapshot();
});
