import {
  ResourceType,
  BundleEntry,
  Resource,
  code,
} from "@iguhealth/fhir-types/r4/types";
import {
  FHIRRequest,
  FHIRResponse,
  InstanceHistoryResponse,
  SystemHistoryResponse,
  SystemSearchResponse,
  TypeHistoryResponse,
  TypeSearchResponse,
} from "@iguhealth/client/types";
import { AsynchronousClient } from "@iguhealth/client";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { FHIRClient } from "@iguhealth/client/interface";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../fhir/types.js";
import { deriveResourceTypeFilter } from "./utilities/search/parameters.js";
import { fhirResponseToBundleEntry } from "./utilities/bundle.js";
import { httpRequestToFHIRRequest } from "../http/index.js";

type InteractionSupported<T> = FHIRRequest["type"];
type InteractionsSupported<T> = InteractionSupported<T>[];

type Source<CTX> = {
  resourcesSupported?: ResourceType[];
  interactionsSupported?: InteractionsSupported<CTX>;
  useSource?: (request: FHIRRequest) => boolean;
  source: FHIRClient<CTX>;
};
type Sources<CTX> = Source<CTX>[];

/*
 ** Sets of requests like search will touch multiple sources.
 ** Mutations though should only resolve to a single source.
 */
function getIsMultiSourced(request: FHIRRequest): boolean {
  switch (request.type) {
    case "search-request":
    case "history-request":
    case "read-request":
    case "vread-request":
    case "batch-request":
      return true;
    case "capabilities-request":
    case "invoke-request":
    case "transaction-request":
    case "create-request":
    case "update-request":
    case "patch-request":
    case "delete-request":
      return false;
  }
}

export function findSource<T>(
  sources: Sources<T>,
  request: FHIRRequest
): Sources<T> {
  const isMultiSourced = getIsMultiSourced(request);
  let found: { source: Source<T>; score: number }[] = [];

  for (const source of sources) {
    if (source.useSource && source.useSource(request)) {
      found = [...found, { source, score: 5 }];
    } else if (
      deriveResourceTypeFilter(request).every((resource) =>
        source.resourcesSupported?.includes(resource)
      ) &&
      source.interactionsSupported?.includes(request.type)
    ) {
      found = [...found, { source, score: 1 }];
    }
  }

  found = found.sort((a, b) => b.score - a.score);
  if (isMultiSourced) return found.map((s) => s.source);
  else {
    if (found.length === 0)
      throw new OperationError(
        outcomeError(
          "not-supported",
          `No source found with support for operation '${
            request.type
          }' for type '${(request as Resource).resourceType}'`
        )
      );
    if (found.length > 1 && found[0].score === found[1].score) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Conflicting sources found for request '${request.type}' for type '${
            (request as Resource).resourceType
          }'`
        )
      );
    }

    return [found[0].source];
  }
}

function createRouterMiddleware<
  CTX extends FHIRServerCTX,
  State extends { sources: Sources<CTX> }
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      const sources = findSource(context.state.sources, context.request);
      switch (context.request.type) {
        // Multi-types allowed
        case "search-request": {
          const responses = (
            await Promise.all(
              sources.map((source) =>
                source.source.request(context.ctx, context.request)
              )
            )
          ).filter(
            (res): res is TypeSearchResponse | SystemSearchResponse =>
              res.type === "search-response"
          );

          return {
            ...context,
            response: {
              ...responses[0],
              body: responses.map((r) => r.body).flat(),
            },
          };
        }
        case "history-request": {
          const responses = (
            await Promise.all(
              sources.map((source) =>
                source.source.request(context.ctx, context.request)
              )
            )
          ).filter(
            (
              res
            ): res is
              | SystemHistoryResponse
              | TypeHistoryResponse
              | InstanceHistoryResponse => res.type === "history-response"
          );

          return {
            ...context,
            response: {
              ...responses[0],
              body: responses.map((r) => r.body).flat(),
            },
          };
        }
        // Search for the first one successful
        case "read-request":
        case "vread-request": {
          const responses = (
            await Promise.all(
              sources.map(async (source) => {
                try {
                  return await source.source.request(
                    context.ctx,
                    context.request
                  );
                } catch (e) {
                  context.ctx.logger.error(e);
                  return undefined;
                }
              })
            )
          ).filter(
            (response): response is FHIRResponse => response !== undefined
          );
          if (responses.length > 1)
            throw new OperationError(
              outcomeError("not-found", `Read response returned two items`)
            );
          if (responses.length !== 1)
            throw new OperationError(
              outcomeError("not-found", `Resource not found`)
            );
          return {
            ...context,
            response: responses[0],
          };
        }

        case "batch-request": {
          const entries: BundleEntry[] = await Promise.all(
            (context.request.body.entry || []).map(
              async (entry, index): Promise<BundleEntry> => {
                try {
                  if (!entry.request?.method) {
                    return {
                      response: {
                        status: "500",
                        outcome: outcomeError(
                          "invalid",
                          `invalid entry in batch at index '${index}'`
                        ),
                      },
                    };
                  }
                  const fhirRequest = httpRequestToFHIRRequest({
                    url: entry.request?.url || "",
                    method: entry.request?.method,
                    body: entry.resource,
                  });

                  const fhirResponse = await context.ctx.client.request(
                    context.ctx,
                    fhirRequest
                  );
                  return fhirResponseToBundleEntry(fhirResponse);
                } catch (e) {
                  return {
                    response: {
                      status: "500",
                      outcome:
                        e instanceof OperationError
                          ? e.operationOutcome
                          : outcomeError(
                              "invalid",
                              `invalid entry in batch at index '${index}'`
                            ),
                    },
                  };
                }
              }
            )
          );
          return {
            ...context,
            response: {
              type: "batch-response",
              level: "system",
              body: {
                resourceType: "Bundle",
                type: "batch-response" as code,
                entry: entries,
              },
            },
          };
        }
        // Mutations and invocations should only have one source
        case "invoke-request":
        case "transaction-request":
        case "create-request":
        case "update-request":
        case "patch-request":
        case "delete-request": {
          if (sources.length > 1)
            throw new Error(
              `Only one source can support create per mutation operation'`
            );
          if (sources.length < 1)
            throw new OperationError(
              outcomeError(
                "not-supported",
                `No source found with support for operation '${
                  context.request.type
                }' for type '${(context.request as Resource).resourceType}'`
              )
            );
          const source = sources[0];
          const response = await source.source.request(
            context.ctx,
            context.request
          );
          return { ...context, response };
        }
        case "capabilities-request":
        default:
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Not supported '${context.request.type}'`
            )
          );
      }
    },
  ]);
}

export default function RouterClient<CTX extends FHIRServerCTX>(
  middleware: MiddlewareAsync<{ sources: Sources<CTX> }, CTX>[],
  sources: Sources<CTX>
): AsynchronousClient<{ sources: Sources<CTX> }, CTX> {
  return new AsynchronousClient<{ sources: Sources<CTX> }, CTX>(
    { sources },
    createMiddlewareAsync([...middleware, createRouterMiddleware()])
  );
}
