import { atom } from "jotai";

import { AsynchronousClient } from "@iguhealth/client";
import createHTTPClient, { HTTPContext } from "@iguhealth/client/http";
import { createMiddlewareAsync } from "@iguhealth/client/middleware";
import { AllInteractions, FHIRResponse } from "@iguhealth/client/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

type CachedClient = AsynchronousClient<HTTPContext>;

export const getClient = atom<ReturnType<typeof createAdminAppClient>>(
  // Q Hack to avoid uneccessary checks.
  undefined as unknown as ReturnType<typeof createAdminAppClient>,
);

const cachedResponse: Record<
  string,
  Promise<FHIRResponse<FHIR_VERSION, AllInteractions | "error">>
> = {};

/*
 ** Cache select calls for performance improvements (notably expansions).
 */
export function createAdminAppClient(
  client: ReturnType<typeof createHTTPClient>,
): CachedClient {
  return new AsynchronousClient(
    createMiddlewareAsync<
      { client: ReturnType<typeof createHTTPClient> },
      HTTPContext
    >({ client: client }, [
      async (state, context) => {
        switch (context.request.type) {
          case "invoke-request": {
            switch (context.request.operation) {
              case "expand": {
                const requestString = JSON.stringify(context.request);
                if (!cachedResponse[requestString]) {
                  cachedResponse[requestString] = state.client.request(
                    context.ctx,
                    context.request,
                  );
                }

                return [
                  state,
                  {
                    ...context,
                    response: await cachedResponse[requestString],
                  },
                ];
              }

              default:
                return [
                  state,
                  {
                    ...context,
                    response: await state.client.request(
                      context.ctx,
                      context.request,
                    ),
                  },
                ];
            }
          }

          default:
            return [
              state,
              {
                ...context,
                response: await state.client.request(
                  context.ctx,
                  context.request,
                ),
              },
            ];
        }
      },
    ]),
  );
}
