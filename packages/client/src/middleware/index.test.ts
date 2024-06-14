import { expect, test } from "@jest/globals";

import { Bundle, code } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/lib/versions";

import { FHIRResponse } from "../types/index.js";
import type { ParsedParameter } from "../url";
import { createMiddlewareAsync } from "./index.js";

test("Test middleware Async", async () => {
  const middleware = createMiddlewareAsync<{}, {}>([
    async (context, next) => {
      if (next) {
        const nextVal = await next(context);
        return {
          ...nextVal,
          response: {
            ...nextVal.response,
            body: {
              ...((nextVal as any).response?.body as any),
              entry: (nextVal.response as any).body?.entry?.map((e: any) => ({
                ...e,
                resource: {
                  id: "123",
                  ...e.resource,
                },
              })),
            } as Bundle,
          } as FHIRResponse,
        };
      }
      return {
        ...context,
        response: {
          fhirVersion: R4,
          parameters: (context.request as any).parameters
            ? ((context.request as any).parameters as ParsedParameter<
                string | number
              >[])
            : [],
          type: "search-response",
          level: "system",
          body: {
            resourceType: "Bundle",
            type: "searchset" as code,
            entry: [],
          } as Bundle,
        },
      };
    },
    async (context, next) => {
      return {
        ...context,
        response: {
          fhirVersion: R4,
          parameters: (context.request as any).parameters
            ? ((context.request as any).parameters as ParsedParameter<
                string | number
              >[])
            : [],
          type: "search-response",
          level: "system",
          body: {
            resourceType: "Bundle",
            type: "searchset" as code,
            entry: [{ resource: { resourceType: "Patient" } }],
          } as Bundle,
        },
      };
    },
  ]);

  const result = middleware({ state: {}, ctx: {}, request: {} as any });
  expect(result).toBeInstanceOf(Promise);
  expect(await result).toEqual({
    state: {},
    request: {},
    ctx: {},
    response: {
      fhirVersion: R4,
      parameters: [],
      type: "search-response",
      level: "system",
      body: {
        resourceType: "Bundle",
        type: "searchset",
        entry: [{ resource: { id: "123", resourceType: "Patient" } }],
      },
    },
  });
});
