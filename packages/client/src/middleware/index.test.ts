import { expect, test } from "@jest/globals";
import { createMiddlewareAsync } from "./index.js";
import type { ParsedParameter } from "../url";

test("Test middleware Async", async () => {
  const middleware = createMiddlewareAsync<{}, {}>([
    async (ctx, next) => {
      if (next) {
        const nextVal = await next(ctx);
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
        state: ctx.state,
        ctx: ctx.ctx,
        response: {
          parameters: (ctx.request as any).parameters
            ? ((ctx.request as any).parameters as ParsedParameter<
                string | number
              >[])
            : [],
          type: "search-response",
          level: "system",
          body: [],
        },
      };
    },
    async (ctx, next) => {
      return {
        state: ctx.state,
        ctx: ctx.ctx,
        response: {
          parameters: (ctx.request as any).parameters
            ? ((ctx.request as any).parameters as ParsedParameter<
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
    ctx: {},
    response: {
      parameters: [],
      type: "search-response",
      level: "system",
      body: [{ id: "123", resourceType: "Patient" }],
    },
  });
});
