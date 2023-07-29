import { ResourceType } from "@iguhealth/fhir-types/r4/types";
import {
  FHIRRequest,
  FHIRResponse,
  SystemHistoryResponse,
  SystemSearchResponse,
  TypeHistoryResponse,
  TypeSearchResponse,
  HistoryInstanceResponse,
} from "../client/types";
import { AsynchronousClient } from "../client/index.js";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "../client/middleware/index.js";
import { FHIRClient } from "../client/interface";
import { FHIRServerCTX } from "../fhirServer.js";

type InteractionSupported<T> = FHIRRequest["type"];
type InteractionsSupported<T> = InteractionSupported<T>[];

type Source<CTX> = {
  resourcesSupported: ResourceType[];
  interactionsSupported: InteractionsSupported<CTX>;
  source: FHIRClient<CTX>;
};
type Sources<CTX> = Source<CTX>[];

type Constraint<T> = Partial<
  Pick<Source<T>, "resourcesSupported" | "interactionsSupported">
>;

function findSource<T>(
  sources: Sources<T>,
  constraints: Constraint<T>
): Sources<T> {
  return sources.filter((source) => {
    return (
      constraints.resourcesSupported?.every((resource) =>
        source.resourcesSupported.includes(resource)
      ) &&
      constraints.interactionsSupported?.every((interaction) =>
        source.interactionsSupported.includes(interaction)
      )
    );
  });
}

function createRouterMiddleware<
  CTX extends FHIRServerCTX,
  State extends { sources: Sources<CTX> }
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (request, args, next) => {
      const constraint = {
        interactionsSupported: [request.type],
        resourcesSupported:
          "resourceType" in request
            ? [request.resourceType as ResourceType]
            : [],
      };
      const sources = findSource(args.state.sources, constraint);
      switch (request.type) {
        // Multi-types allowed
        case "search-request":
        case "history-request": {
          const responses = (
            await Promise.all(
              sources.map((source) => source.source.request(args.ctx, request))
            )
          ).filter(
            (
              res
            ): res is
              | TypeSearchResponse
              | SystemSearchResponse
              | SystemHistoryResponse
              | TypeHistoryResponse
              | HistoryInstanceResponse =>
              res.type === "history-response" || res.type === "search-response"
          );
          return {
            state: args.state,
            ctx: args.ctx,
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
                  return await source.source.request(args.ctx, request);
                } catch (e) {
                  console.error(e);
                  return undefined;
                }
              })
            )
          ).filter(
            (response): response is FHIRResponse => response !== undefined
          );
          if (responses.length !== 1)
            throw new Error(`Could not perform request type '${request.type}'`);
          return { state: args.state, ctx: args.ctx, response: responses[0] };
        }

        // Mutations and invocations should only have one source
        case "invoke-request":
        case "batch-request":
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
            throw new Error(
              `No source found for mutation operation '${
                request.type
              } and resource type '${(request as any).resourceType}'`
            );
          const source = sources[0];
          const response = await source.source.request(args.ctx, request);
          return { state: args.state, ctx: args.ctx, response };
        }
        case "capabilities-request":
        default:
          throw new Error(`Not supported '${request.type}'`);
      }
    },
  ]);
}

export default function RouterDatabase<CTX extends FHIRServerCTX>(
  sources: Sources<CTX>
): AsynchronousClient<{ sources: Sources<CTX> }, CTX> {
  return new AsynchronousClient<{ sources: Sources<CTX> }, CTX>(
    { sources },
    createRouterMiddleware()
  );
}
