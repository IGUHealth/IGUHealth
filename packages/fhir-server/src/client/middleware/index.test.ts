import { FHIRURL } from "@genfhi/fhir-query";
import { Resource } from "@genfhi/fhir-types/r4/types";
import { FHIRRequest } from "../types";
import createMiddleware, { MiddlewareSync } from "./index";

test("Test middleware", () => {
  const middleware = createMiddleware<{}, {}>([
    (request, args, next) => {
      if (next) {
        const nextVal = next(request, args);
        return {
          ...nextVal,
          response: {
            ...nextVal.response,
            body: (nextVal.response as any).body?.map((resource) => ({
              ...resource,
              id: "123",
            })),
          },
        };
      }
      return {
        state: args.state,
        ctx: args.ctx,
        response: {
          query: (request as any).query as FHIRURL,
          type: "search-response",
          level: "system",
          body: [],
        },
      };
    },
    (request, args, next) => {
      const body: Resource[] = [{ resourceType: "Patient" }];
      return {
        state: args.state,
        ctx: args.ctx,
        response: {
          query: (request as any).query as FHIRURL,
          type: "search-response",
          level: "system",
          body: body,
        },
      };
    },
  ]);
  expect(middleware({} as any, { state: {}, ctx: {} } as any)).toEqual({
    state: {},
    ctx: {},
    response: {
      query: undefined,
      type: "search-response",
      level: "system",
      body: [{ resourceType: "Patient" }],
    },
  });
});
