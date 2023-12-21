import { expect, test } from "@jest/globals";
import { createMiddlewareAsync } from "./index.js";
import type { ParsedParameter } from "../url";

test("Test middleware Async", async () => {
  const middleware = createMiddlewareAsync<{}, {}>([
    async (context, next) => {
      if (next) {
        const nextVal = await next(context);
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
        ...context,
        response: {
          parameters: (context.request as any).parameters
            ? ((context.request as any).parameters as ParsedParameter<
                string | number
              >[])
            : [],
          type: "search-response",
          level: "system",
          body: [],
        },
      };
    },
    async (context, next) => {
      return {
        ...context,
        response: {
          parameters: (context.request as any).parameters
            ? ((context.request as any).parameters as ParsedParameter<
                string | number
              >[])
            : [],
          type: "search-response",
          level: "system",
          body: [{ resourceType: "Patient" }],
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
      parameters: [],
      type: "search-response",
      level: "system",
      body: [{ id: "123", resourceType: "Patient" }],
    },
  });
});
