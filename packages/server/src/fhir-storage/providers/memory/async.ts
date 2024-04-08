import { nanoid } from "nanoid";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/lib/types";
import { ParsedParameter } from "@iguhealth/client/lib/url";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  AResource,
  Bundle,
  BundleEntry,
  CapabilityStatement,
  ConcreteType,
  Resource,
  ResourceMap,
  ResourceType,
  SearchParameter,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { IOperation, OPMetadata } from "@iguhealth/operation-execution";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { createResolveTypeToCanonical } from "../../../fhir-context/index.js";
import { FHIRServerCTX } from "../../../fhir-context/types.js";
import {
  SearchParameterResource,
  SearchParameterResult,
  deriveResourceTypeFilter,
  parametersWithMetaAssociated,
} from "../../utilities/search/parameters.js";
import { fitsSearchCriteria } from "./search.js";
import { InternalData } from "./types.js";

// Need special handling of SearchParameter to avoid infinite recursion.
async function resolveParameter(
  data: InternalData<ResourceType>,
  resourceTypes: ResourceType[],
  name: string,
) {
  const params = Object.values(data?.["SearchParameter"] || {}).filter(
    (p): p is SearchParameter =>
      p?.resourceType === "SearchParameter" &&
      p?.name === name &&
      p?.base?.some((b) => resourceTypes.includes(b as ResourceType)),
  );
  return params;
}

function createMemoryMiddleware<
  State extends { data: InternalData<ResourceType> },
  CTX extends FHIRServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      /* eslint-disable no-fallthrough */
      switch (context.request.type) {
        case "search-request": {
          const resourceTypes = deriveResourceTypeFilter(context.request);
          // Remove _type as using on derived resourceTypeFilter
          context.request.parameters = context.request.parameters.filter(
            (p) => p.name !== "_type",
          );

          const parameters = await parametersWithMetaAssociated(
            async (resourceTypes, name) =>
              resolveParameter(context.state.data, resourceTypes, name),
            resourceTypes,
            context.request.parameters,
          );

          // Standard parameters
          const resourceParameters = parameters.filter(
            (v): v is SearchParameterResource => v.type === "resource",
          );

          const resourceSet =
            context.request.level === "type"
              ? Object.values(
                  context.state.data[context.request.resourceType] || {},
                ).filter((v): v is Resource => v !== undefined)
              : (resourceTypes.length > 0
                  ? resourceTypes
                  : Object.keys(context.state.data)
                )
                  .map((k) =>
                    Object.values(context.state.data[k as ResourceType] || {}),
                  )
                  .filter((v): v is Resource[] => v !== undefined)
                  .flat();

          let result = [];
          for (const resource of resourceSet || []) {
            if (
              await fitsSearchCriteria(
                context.ctx,
                resource,
                resourceParameters,
              )
            ) {
              result.push(resource);
            }
          }

          const parametersResult = parameters.filter(
            (v): v is SearchParameterResult => v.type === "result",
          );

          const offsetParam = parametersResult.find(
            (v) => v.name === "_offset",
          );

          if (offsetParam) {
            if (isNaN(parseInt(offsetParam.value[0].toString())))
              throw new OperationError(
                outcomeError("invalid", "_offset must be a single number"),
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
              outcomeError("invalid", "Updated resource must have an id."),
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
          if (!resource?.id) resource.id = nanoid() as id;

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
              `Not found resource of type '${context.request.resourceType}' with id '${context.request.id}'`,
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
              `Request not supported '${context.request.type}'`,
            ),
          );
      }
    },
  ]);
}

interface MemoryClientInterface<CTX> extends FHIRClientAsync<CTX> {
  resolveCanonical<T extends ResourceType>(): void;
  resolveTypeToCanonical<T extends ResourceType>(): void;
}

class Memory<CTX> implements MemoryClientInterface<CTX> {
  private _client;

  public request: FHIRClientAsync<CTX>["request"];
  public capabilities: FHIRClientAsync<CTX>["capabilities"];
  public search_system: FHIRClientAsync<CTX>["search_system"];
  public search_type: FHIRClientAsync<CTX>["search_type"];
  public create: FHIRClientAsync<CTX>["create"];
  public update: FHIRClientAsync<CTX>["update"];
  public patch: FHIRClientAsync<CTX>["patch"];
  public read: FHIRClientAsync<CTX>["read"];
  public vread: FHIRClientAsync<CTX>["vread"];
  public delete: FHIRClientAsync<CTX>["delete"];
  public historySystem: FHIRClientAsync<CTX>["historySystem"];
  public historyType: FHIRClientAsync<CTX>["historyType"];
  public historyInstance: FHIRClientAsync<CTX>["historyInstance"];
  public invoke_system: FHIRClientAsync<CTX>["invoke_system"];
  public invoke_type: FHIRClientAsync<CTX>["invoke_type"];
  public invoke_instance: FHIRClientAsync<CTX>["invoke_instance"];
  public transaction: FHIRClientAsync<CTX>["transaction"];
  public batch: FHIRClientAsync<CTX>["batch"];

  constructor(
    client: AsynchronousClient<
      {
        data: InternalData<ResourceType>;
      },
      CTX
    >,
  ) {
    this._client = client;
    this.request = this._client.request;
    this.capabilities = this._client.capabilities;

    this.search_system = this._client.search_system;
    this.search_type = this._client.search_type;

    this.create = this._client.create;
    this.update = this._client.update;
    this.patch = this._client.patch;
    this.read = this._client.read;
    this.vread = this._client.vread;
    this.delete = this._client.delete;

    this.historySystem = this._client.historySystem;
    this.historyType = this._client.historyType;
    this.historyInstance = this._client.historyInstance;

    this.invoke_system = this._client.invoke_system;
    this.invoke_type = this._client.invoke_type;
    this.invoke_instance = this._client.invoke_instance;

    this.transaction = this._client.transaction;
    this.batch = this._client.batch;
  }
  resolveCanonical<T extends keyof ResourceMap>(): void {}
  resolveTypeToCanonical<T extends keyof ResourceMap>(): void {}
}

export default function MemoryDatabase<CTX extends FHIRServerCTX>(
  data: InternalData<ResourceType>,
): Memory<CTX> {
  const client = new AsynchronousClient<
    { data: InternalData<ResourceType> },
    CTX
  >({ data: data }, createMemoryMiddleware());

  return new Memory(client);
}
