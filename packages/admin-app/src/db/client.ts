import { atom } from "recoil";

import { AsynchronousClient } from "@iguhealth/client";
import createHTTPClient from "@iguhealth/client/http";
import { createMiddlewareAsync } from "@iguhealth/client/middleware";
import { FHIRResponse } from "@iguhealth/client/types";

type CachedClient = AsynchronousClient<
  {
    client: AsynchronousClient<
      { client: ReturnType<typeof createAdminAppClient> },
      Record<string, never>
    >;
  },
  Record<string, never>
>;

export const getClient = atom<ReturnType<typeof createAdminAppClient>>({
  key: "client",
  default: undefined,
});

const cachedResponse: Record<string, Promise<FHIRResponse>> = {};

/*
 ** Cache select calls for performance improvements (notably expansions).
 */
export function createAdminAppClient(
  client: ReturnType<typeof createHTTPClient>,
): CachedClient {
  return new AsynchronousClient(
    { client: client },
    createMiddlewareAsync<
      { client: ReturnType<typeof createHTTPClient> },
      Record<string, never>
    >([
      async (context) => {
        switch (context.request.type) {
          case "invoke-request": {
            switch (context.request.operation) {
              case "expand": {
                const requestString = JSON.stringify(context.request);
                if (!cachedResponse[requestString]) {
                  cachedResponse[requestString] = context.state.client.request(
                    context.ctx,
                    context.request,
                  );
                }

                return {
                  ...context,
                  response: await cachedResponse[requestString],
                };
              }

              default:
                return {
                  ...context,
                  response: await context.state.client.request(
                    context.ctx,
                    context.request,
                  ),
                };
            }
          }

          default:
            return {
              ...context,
              response: await context.state.client.request(
                context.ctx,
                context.request,
              ),
            };
        }
      },
    ]),
  );
}
