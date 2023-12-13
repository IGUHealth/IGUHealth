import { atom } from "recoil";

import { createMiddlewareAsync } from "@iguhealth/client/middleware";
import createHTTPClient from "@iguhealth/client/http";
import { AsynchronousClient } from "@iguhealth/client";
import { FHIRResponse } from "@iguhealth/client/types";

type CachedClient = AsynchronousClient<
  {
    client: AsynchronousClient<
      { client: ReturnType<typeof createCachedClient> },
      Record<string, never>
    >;
  },
  Record<string, never>
>;

export const getClient = atom<ReturnType<typeof createCachedClient>>({
  key: "client",
  default: undefined,
});

const cachedResponse: Record<string, Promise<FHIRResponse>> = {};

/*
 ** Cache select calls for performance improvements (notably expansions).
 */
export function createCachedClient(
  client: ReturnType<typeof createHTTPClient>
): CachedClient {
  return new AsynchronousClient(
    { client: client },
    createMiddlewareAsync<
      { client: ReturnType<typeof createHTTPClient> },
      Record<string, never>
    >([
      async (request, args) => {
        switch (request.type) {
          case "invoke-request": {
            switch (request.operation) {
              case "expand": {
                const requestString = JSON.stringify(request);
                if (!cachedResponse[requestString]) {
                  cachedResponse[requestString] = args.state.client.request(
                    args.ctx,
                    request
                  );
                }

                return {
                  ctx: args.ctx,
                  state: args.state,
                  response: await cachedResponse[requestString],
                };
              }

              default:
                return {
                  ctx: args.ctx,
                  state: args.state,
                  response: await args.state.client.request(args.ctx, request),
                };
            }
          }

          default:
            return {
              ctx: args.ctx,
              state: args.state,
              response: await args.state.client.request(args.ctx, request),
            };
        }
      },
    ])
  );
}
