import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClient } from "@iguhealth/client/interface";
import {
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  FHIRRequest,
  FHIRResponse,
  R4BConditinalUpdateRequest,
  R4ConditinalUpdateRequest,
  R4InstanceHistoryResponse,
  R4SystemHistoryResponse,
  R4SystemSearchResponse,
  R4TypeHistoryResponse,
  R4TypeSearchResponse,
} from "@iguhealth/client/types";
import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { R4, R4B } from "@iguhealth/fhir-types/versions";
import {
  OperationError,
  isOperationError,
  issueToStatusCode,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { httpRequestToFHIRRequest } from "../../../fhir-http/index.js";
import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { fhirResponseToBundleEntry } from "../../utilities/bundle.js";
import { deriveResourceTypeFilter } from "../../../search-stores/parameters.js";

type InteractionSupported = FHIRRequest["type"];
type InteractionsSupported = InteractionSupported[];

type R4Filter = {
  levelsSupported?: FHIRRequest["level"][];
  resourcesSupported?: r4.ResourceType[];
  interactionsSupported?: InteractionsSupported;
};

type R4BFilter = {
  levelsSupported?: FHIRRequest["level"][];
  resourcesSupported?: r4b.ResourceType[];
  interactionsSupported?: InteractionsSupported;
};

type Source<CTX> = {
  filter?: {
    r4?: R4Filter;
    r4b?: R4BFilter;
    useSource?: (request: FHIRRequest) => boolean;
  };

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

function getFilter<T>(
  source: Source<T>,
  request: FHIRRequest,
): R4Filter | R4BFilter {
  switch (request.fhirVersion) {
    case R4:
      return source.filter?.r4 || {};
    case R4B:
      return source.filter?.r4b || {};
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          //@ts-ignore
          `FHIR version '${request.fhirVersion}' not supported`,
        ),
      );
  }
}

export function findSource<T>(
  sources: Sources<T>,
  request: FHIRRequest,
): Sources<T> {
  const isMultiSourced = getIsMultiSourced(request);
  let found: { source: Source<T>; score: number }[] = [];

  for (const source of sources) {
    const fhirVersionPropertyFilter = getFilter(source, request);

    // Function based filter.
    if (source?.filter?.useSource && source?.filter?.useSource(request)) {
      found = [...found, { source, score: 5 }];
    } else if (
      deriveResourceTypeFilter(request).every((resourceType) =>
        (
          fhirVersionPropertyFilter?.resourcesSupported as string[] | undefined
        )?.includes(resourceType),
      ) &&
      fhirVersionPropertyFilter.interactionsSupported?.includes(request.type) &&
      fhirVersionPropertyFilter.levelsSupported?.includes(request.level)
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
          }' for type '${(request as R4BConditinalUpdateRequest).resource}'`,
        ),
      );
    if (found.length > 1 && found[0].score === found[1].score) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Conflicting sources found for request '${request.type}' for type '${
            (request as R4BConditinalUpdateRequest).resource
          }'`,
        ),
      );
    }

    return [found[0].source];
  }
}

function createRouterMiddleware<
  CTX extends IGUHealthServerCTX,
  State extends { sources: Sources<CTX> },
>(): MiddlewareAsyncChain<State, CTX> {
  return async function routerMiddleware(context) {
    const sources = findSource(context.state.sources, context.request);

    if (sources.length === 0) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `No source found with support for operation '${context.request.type}' for level '${context.request.level}' and  type '${context.request.level === "type" || context.request.level === "instance" ? context.request.resource : "none"}'`,
        ),
      );
    }

    switch (context.request.type) {
      // Multi-types allowed
      case "search-request": {
        const responses = (
          await Promise.all(
            sources.map((source) =>
              source.source.request(context.ctx, context.request),
            ),
          )
        ).filter(
          (res): res is R4TypeSearchResponse | R4SystemSearchResponse =>
            res.type === "search-response",
        );

        const entry = responses.map((b) => b.body.entry ?? []).flat();
        return {
          ...context,
          response: {
            ...responses[0],
            body: {
              resourceType: "Bundle",
              type: "searchset" as r4.code,
              total: responses.reduce(
                (acc: number | undefined, res) =>
                  res.body.total ? (acc ?? 0) + res.body.total : undefined,
                undefined,
              ) as r4.unsignedInt | undefined,
              entry,
            },
          },
        };
      }
      case "history-request": {
        const responses = (
          await Promise.all(
            sources.map((source) =>
              source.source.request(context.ctx, context.request),
            ),
          )
        ).filter(
          (
            res,
          ): res is
            | R4SystemHistoryResponse
            | R4TypeHistoryResponse
            | R4InstanceHistoryResponse => res.type === "history-response",
        );

        const entry = responses.map((b) => b.body.entry ?? []).flat();

        return {
          ...context,
          response: {
            ...responses[0],
            body: {
              resourceType: "Bundle",
              type: "history" as r4.code,
              entry,
            },
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
                  context.request,
                );
              } catch (e) {
                context.ctx.logger.error(e);
                return undefined;
              }
            }),
          )
        ).filter(
          (response): response is FHIRResponse => response !== undefined,
        );

        if (responses.length > 1)
          throw new OperationError(
            outcomeError("not-found", `Read response returned two items`),
          );

        if (responses.length !== 1)
          throw new OperationError(
            outcomeError("not-found", `Resource not found`),
          );

        return {
          ...context,
          response: responses[0],
        };
      }

      case "batch-request": {
        const entries: r4.BundleEntry[] = await Promise.all(
          (context.request.body.entry || []).map(
            async (entry, index): Promise<r4.BundleEntry> => {
              try {
                if (!entry.request?.method) {
                  return {
                    response: {
                      status: "500",
                      outcome: outcomeError(
                        "invalid",
                        `invalid entry in batch at index '${index}'`,
                      ),
                    },
                  };
                }
                const fhirRequest = httpRequestToFHIRRequest(
                  context.request.fhirVersion,
                  {
                    url: entry.request?.url || "",
                    method: entry.request?.method,
                    body: entry.resource,
                  },
                );

                const fhirResponse = await context.ctx.client.request(
                  context.ctx,
                  fhirRequest,
                );
                return fhirResponseToBundleEntry(
                  context.ctx.tenant,
                  fhirResponse,
                );
              } catch (e) {
                if (isOperationError(e)) {
                  return {
                    response: {
                      status: issueToStatusCode(
                        e.operationOutcome.issue?.[0],
                      ).toString(),
                      outcome: e.operationOutcome,
                    },
                  };
                }
                return {
                  response: {
                    status: "500",
                    outcome: outcomeFatal(
                      "unknown",
                      "An unknown error occured.",
                    ),
                  },
                };
              }
            },
          ),
        );
        return {
          ...context,
          response: {
            fhirVersion: context.request.fhirVersion,
            type: "batch-response",
            level: "system",
            body: {
              resourceType: "Bundle",
              type: "batch-response" as r4.code | r4b.code,
              entry: entries as r4b.BundleEntry[] | r4.BundleEntry[],
            } as r4b.Bundle | r4.Bundle,
          } as FHIRResponse,
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
            `Only one source can support create per mutation operation'`,
          );
        if (sources.length < 1)
          throw new OperationError(
            outcomeError(
              "not-supported",
              `No source found with support for operation '${
                context.request.type
              }' for type '${(context.request as R4ConditinalUpdateRequest).resource}'`,
            ),
          );
        const source = sources[0];
        const response = await source.source.request(
          context.ctx,
          context.request,
        );
        return { ...context, response };
      }
      case "capabilities-request":
      default:
        throw new OperationError(
          outcomeError(
            "not-supported",
            `Not supported '${context.request.type}'`,
          ),
        );
    }
  };
}

export default function RouterClient<CTX extends IGUHealthServerCTX>(
  middleware: MiddlewareAsyncChain<{ sources: Sources<CTX> }, CTX>[],
  sources: Sources<CTX>,
): AsynchronousClient<{ sources: Sources<CTX> }, CTX> {
  return new AsynchronousClient<{ sources: Sources<CTX> }, CTX>(
    { sources },
    createMiddlewareAsync([...middleware, createRouterMiddleware()], {
      logging: false,
    }),
  );
}
