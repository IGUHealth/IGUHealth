import { expect, test } from "@jest/globals";

import {
  AllInteractions,
  FHIRRequest,
  FHIRResponse,
} from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  AccessPolicyV2,
  Patient,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

import { testServices } from "../../fhir-clients/test-ctx.js";
import { IGUHealthServerCTX } from "../../fhir-server/types.js";
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

  const responder: MiddlewareAsyncChain<unknown, IGUHealthServerCTX> = async (
    state,
    context,
  ) => {
    return [
      state,
      {
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
        } as FHIRResponse<FHIR_VERSION, AllInteractions>,
      },
    ];
  };

  const middleware = createMiddlewareAsync(undefined, [
    authorizationMiddleware,
    responder,
  ]);

  expect(
    (
      await middleware({
        ctx: ctx,

        request: {
          type: "read-request",
          level: "instance",
          resource: "Patient",
          id: "1",
        } as FHIRRequest<FHIR_VERSION, AllInteractions>,
      })
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
      await middleware({
        ctx: ctx,
        request: {
          type: "search-request",
          level: "type",
          resource: "Patient",
        } as FHIRRequest<FHIR_VERSION, AllInteractions>,
      });
    } catch (e) {
      // @ts-ignore
      throw e.operationOutcome;
    }
  }).rejects.toMatchSnapshot();
});
