import {
  ResourceType,
  Resource,
  SearchParameter,
} from "@iguhealth/fhir-types/r4/types";
import { AsynchronousClient } from "@iguhealth/client";
import { v4 } from "uuid";
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
    async (context) => {
      /* eslint-disable no-fallthrough */
      switch (context.request.type) {
        case "search-request": {
          const resourceTypes = deriveResourceTypeFilter(context.request);
          // Remove _type as using on derived resourceTypeFilter
          context.request.parameters = context.request.parameters.filter(
            (p) => p.name !== "_type"
          );

          const parameters = await parametersWithMetaAssociated(
            async (resourceTypes, name) =>
              resolveParameter(context.state.data, resourceTypes, name),
            resourceTypes,
            context.request.parameters
          );

          // Standard parameters
          const resourceParameters = parameters.filter(
            (v): v is SearchParameterResource => v.type === "resource"
          );

          const resourceSet =
            context.request.level === "type"
              ? Object.values(
                  context.state.data[context.request.resourceType] || {}
                ).filter((v): v is Resource => v !== undefined)
              : Object.keys(context.state.data)
                  .map((k) =>
                    Object.values(context.state.data[k as ResourceType] || {})
                  )
                  .filter((v): v is Resource[] => v !== undefined)
                  .flat();

          let result = [];
          for (const resource of resourceSet || []) {
            if (
              await fitsSearchCriteria(
                context.ctx,
                resource,
                resourceParameters
              )
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
          switch (context.request.level) {
            case "system": {
              return {
                ...context,
                response: {
                  level: context.request.level,
                  parameters: context.request.parameters,
                  type: "search-response",
                  body: result,
                },
              };
            }
            case "type": {
              return {
                ...context,
                response: {
                  resourceType: context.request.resourceType,
                  level: "type",
                  parameters: context.request.parameters,
                  type: "search-response",
                  body: result,
                },
              };
            }
          }
        }
        case "update-request": {
          const resource = context.request.body;
          if (!resource.id)
            throw new OperationError(
              outcomeError("invalid", "Updated resource must have an id.")
            );
          context.state.data = {
            ...context.state.data,
            [resource.resourceType]: {
              ...context.state.data[resource.resourceType],
              [resource.id]: resource,
            },
          };

          return {
            ...context,
            response: {
              level: "instance",
              type: "update-response",
              resourceType: context.request.resourceType,
              id: resource.id,
              body: resource,
            },
          };
        }
        case "create-request": {
          const resource = context.request.body;
          const resources = context.state.data[context.request.resourceType];
          if (!resource?.id) resource.id = v4();

          context.state.data = {
            ...context.state.data,
            [resource.resourceType]: {
              ...resources,
              [resource.id]: resource,
            },
          };
          return {
            ...context,
            response: {
              level: "type",
              type: "create-response",
              resourceType: context.request.resourceType,
              body: resource,
            },
          };
        }
        case "read-request": {
          const data =
            context.state.data[context.request.resourceType]?.[
              context.request.id
            ];
          if (!data) {
            throw new Error(
              `Not found resource of type '${context.request.resourceType}' with id '${context.request.id}'`
            );
          }
          return {
            ...context,
            response: {
              level: "instance",
              type: "read-response",
              resourceType: context.request.resourceType,
              id: context.request.id,
              body: data,
            },
          };
        }
        default:
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Request not supported '${context.request.type}'`
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
