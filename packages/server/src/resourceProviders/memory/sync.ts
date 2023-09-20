import { ResourceType, Resource } from "@iguhealth/fhir-types/r4/types";
import { ParsedParameter } from "@iguhealth/client/url";
import { SynchronousClient } from "@iguhealth/client";
import {
  createMiddlewareSync,
  MiddlewareSync,
} from "@iguhealth/client/middleware";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { InternalData } from "./types.js";

function fitsSearchCriteria(
  criteria: ParsedParameter<unknown>,
  resource: Resource
): boolean {
  if (criteria.modifier) throw new Error("Modifiers not supported");
  switch (criteria.name) {
    case "base":
    case "name":
    case "type":
    case "url": {
      // Q hack because safe in requires explicit string properties it seems.
      const value = (resource as unknown as Record<string, string | number>)[
        criteria.name
      ];
      if (Array.isArray(value)) {
        return value.some((v) => criteria.value.indexOf(v) !== -1);
      }
      return criteria.value.indexOf(value) !== -1;
    }
    default:
      //console.warn(`received unknown criteria for memory: '${criteria.name}'`);
      return false;
  }
}

function createMemoryMiddleware<
  State extends { data: InternalData<ResourceType> },
  CTX extends any
>(): MiddlewareSync<State, CTX> {
  return createMiddlewareSync<State, CTX>([
    (request, args, next) => {
      switch (request.type) {
        case "search-request": {
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

          const output = (resourceSet || []).filter((resource) => {
            for (let param of request.parameters) {
              if (!fitsSearchCriteria(param, resource)) return false;
            }
            return true;
          });
          if (request.level === "system") {
            return {
              state: args.state,
              ctx: args.ctx,
              response: {
                level: request.level,
                parameters: request.parameters,
                type: "search-response",
                body: output,
              },
            };
          }
          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              resourceType: request.resourceType,
              level: "type",
              parameters: request.parameters,
              type: "search-response",
              body: output,
            },
          };
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
              ...args.state.data[resource.resourceType],
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

export default function MemoryDatabase<CTX>(
  data: InternalData<ResourceType>
): SynchronousClient<{ data: InternalData<ResourceType> }, CTX> {
  return new SynchronousClient<{ data: InternalData<ResourceType> }, CTX>(
    { data: data },
    createMemoryMiddleware()
  );
}
