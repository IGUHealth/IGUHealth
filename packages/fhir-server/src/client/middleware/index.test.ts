import { FHIRURL } from "@genfhi/fhir-query";
import { createMiddlewareSync, createMiddlewareAsync } from "./index";

test("Test middleware Sync", () => {
  const middleware = createMiddlewareSync<{}, {}>([
    (request, args, next) => {
      if (next) {
        const nextVal = next(request, args);
        return {
          ...nextVal,
          response: {
            ...nextVal.response,
            body: (nextVal.response as any).body?.map((resource: any) => ({
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
      const body = [{ resourceType: "Patient" }];
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
      body: [{ id: "123", resourceType: "Patient" }],
    },
  });
});

test("Test middleware Async", async () => {
  const middleware = createMiddlewareAsync<{}, {}>([
    async (request, args, next) => {
      if (next) {
        const nextVal = await next(request, args);
        return {
          ...nextVal,
          response: {
            ...nextVal.response,
            body: (nextVal.response as any).body?.map((resource: any) => ({
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
    async (request, args, next) => {
      return {
        state: args.state,
        ctx: args.ctx,
        response: {
          query: (request as any).query as FHIRURL,
          type: "search-response",
          level: "system",
          body: [{ resourceType: "Patient" }],
        },
      };
    },
  ]);
  const result = middleware({} as any, { state: {}, ctx: {} });
  expect(result).toBeInstanceOf(Promise);
  expect(await result).toEqual({
    state: {},
    ctx: {},
    response: {
      query: undefined,
      type: "search-response",
      level: "system",
      body: [{ id: "123", resourceType: "Patient" }],
    },
  });
});
