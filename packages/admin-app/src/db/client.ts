import { atom } from "recoil";

import { VersionedAsynchronousClient } from "@iguhealth/client";
import createHTTPClient from "@iguhealth/client/http";
import { Versioned } from "@iguhealth/client/lib/interface";
import { createMiddlewareAsync } from "@iguhealth/client/middleware";
import { FHIRResponse } from "@iguhealth/client/types";

type CachedClient = VersionedAsynchronousClient<
  {
    client: VersionedAsynchronousClient<
      { client: ReturnType<typeof createAdminAppClient> },
      Versioned
    >;
  },
  Versioned
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
  return new VersionedAsynchronousClient(
    { client: client },
    createMiddlewareAsync<
      { client: ReturnType<typeof createHTTPClient> },
      Versioned
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
