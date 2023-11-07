import {
  ResourceType,
  Resource,
  SearchParameter,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { AsynchronousClient } from "@iguhealth/client";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/middleware";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import {
  parametersWithMetaAssociated,
  SearchParameterResource,
  SearchParameterResult,
  deriveResourceTypeFilter,
} from "../utilities/search/parameters.js";
import { InternalData } from "./types.js";
import { fitsSearchCriteria } from "./search.js";
import { AsyncMemoryCTX } from "./types.js";

// Need special handling of SearchParameter to avoid infinite recursion.
async function resolveParameter(
  data: InternalData<ResourceType>,
  resourceTypes: ResourceType[],
  name: string
) {
  const params = Object.values(data?.["SearchParameter"] || {}).filter(
    (p): p is SearchParameter =>
      p?.resourceType === "SearchParameter" &&
      p?.name === name &&
      p?.base?.some((b) => resourceTypes.includes(b as ResourceType))
  );
  return params;
}

function createMemoryMiddleware<
  State extends { data: InternalData<ResourceType> },
  CTX extends AsyncMemoryCTX
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (request, args, next) => {
      /* eslint-disable no-fallthrough */
      switch (request.type) {
        case "search-request": {
          const resourceTypes = deriveResourceTypeFilter(request);
          // Remove _type as using on derived resourceTypeFilter
          request.parameters = request.parameters.filter(
            (p) => p.name !== "_type"
          );

          const parameters = await parametersWithMetaAssociated(
            resourceTypes,
            request.parameters,
            async (resourceTypes, name) =>
              resolveParameter(args.state.data, resourceTypes, name)
          );

          // Standard parameters
          const resourceParameters = parameters.filter(
            (v): v is SearchParameterResource => v.type === "resource"
          );

          const resourceSet =
            request.level === "type"
              ? Object.values(
                  args.state.data[request.resourceType as ResourceType] || {}
                ).filter((v): v is Resource => v !== undefined)
              : Object.keys(args.state.data)
                  .map((k) =>
                    Object.values(args.state.data[k as ResourceType] || {})
                  )
                  .filter((v): v is Resource[] => v !== undefined)
                  .flat();

          let result = [];
          for (const resource of resourceSet || []) {
            if (
              await fitsSearchCriteria(args.ctx, resource, resourceParameters)
            ) {
              result.push(resource);
            }
          }

          const parametersResult = parameters.filter(
            (v): v is SearchParameterResult => v.type === "result"
          );

          const offsetParam = parametersResult.find(
            (v) => v.name === "_offset"
          );

          if (offsetParam) {
            if (isNaN(parseInt(offsetParam.value[0].toString())))
              throw new OperationError(
                outcomeError("invalid", "_offset must be a single number")
              );
            result = result.slice(parseInt(offsetParam.value[0].toString()));
          }

          const countParam = parametersResult.find((v) => v.name === "_count");
          const total =
            countParam && !isNaN(parseInt(countParam.value[0].toString()))
              ? parseInt(countParam.value[0].toString())
              : 50;

          result = result.slice(0, total);
          switch (request.level) {
            case "system": {
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  level: request.level,
                  parameters: request.parameters,
                  type: "search-response",
                  body: result,
                },
              };
            }
            case "type": {
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  resourceType: request.resourceType,
                  level: "type",
                  parameters: request.parameters,
                  type: "search-response",
                  body: result,
                },
              };
            }
          }
        }
        case "update-request": {
          const resource = request.body;
          if (!resource.id)
            throw new OperationError(
              outcomeError("invalid", "Updated resource must have an id.")
            );
          args.state.data = {
            ...args.state.data,
            [resource.resourceType]: {
              ...args.state.data[resource.resourceType],
              [resource.id]: resource,
            },
          };

          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "instance",
              type: "update-response",
              resourceType: request.resourceType,
              id: resource.id,
              body: resource,
            },
          };
        }
        case "create-request": {
          const resource = request.body;
          const resources =
            args.state.data[request.resourceType as ResourceType];
          if (!resource?.id)
            resource.id = `${Math.round(Math.random() * 100000000)}`;

          args.state.data = {
            ...args.state.data,
            [resource.resourceType]: {
              ...resources,
              [resource.id]: resource,
            },
          };
          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "type",
              type: "create-response",
              resourceType: request.resourceType,
              body: resource,
            },
          };
        }
        case "read-request": {
          const data =
            args.state.data[request.resourceType as ResourceType]?.[request.id];
          if (!data) {
            throw new Error(
              `Not found resource of type '${request.resourceType}' with id '${request.id}'`
            );
          }
          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "instance",
              type: "read-response",
              resourceType: request.resourceType,
              id: request.id,
              body: data,
            },
          };
        }
        default:
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Request not supported '${request.type}'`
            )
          );
      }
    },
  ]);
}

export default function MemoryDatabase<CTX extends AsyncMemoryCTX>(
  data: InternalData<ResourceType>
): AsynchronousClient<{ data: InternalData<ResourceType> }, CTX> {
  return new AsynchronousClient<{ data: InternalData<ResourceType> }, CTX>(
    { data: data },
    createMemoryMiddleware()
  );
}
