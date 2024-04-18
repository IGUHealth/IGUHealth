import { nanoid } from "nanoid";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

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
  data: InternalData<r4.ResourceType>,
  resourceTypes: r4.ResourceType[],
  name: string,
) {
  const params = Object.values(data?.["SearchParameter"] || {}).filter(
    (p): p is r4.SearchParameter =>
      p?.resourceType === "SearchParameter" &&
      p?.name === name &&
      p?.base?.some((b) => resourceTypes.includes(b as r4.ResourceType)),
  );

  return params;
}

function checkSearchParameter(
  searchParameter: r4.SearchParameter,
  resourceParameters: SearchParameterResource[],
) {
  for (const resourceParameter of resourceParameters) {
    switch (resourceParameter.name) {
      case "base":
      case "code":
      case "date":
      case "description":
      case "name":
      case "publisher":
      case "status":
      case "target":
      case "type":
      case "url":
      case "version": {
        const value = searchParameter[resourceParameter.name];
        const valuesToCheck = Array.isArray(value) ? value : [value];

        // @ts-ignore
        if (!valuesToCheck.some((v) => resourceParameter.value.includes(v)))
          return false;

        break;
      }
      default: {
        throw new OperationError(
          outcomeError(
            "not-supported",
            `'${resourceParameter.name}' is not supported for SearchParameter resources.`,
          ),
        );
      }
    }
  }

  return true;
}

function createMemoryMiddleware<
  State extends { data: InternalData<r4.ResourceType> },
  CTX extends FHIRServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      switch (context.request.fhirVersion) {
        case "4.3": {
          throw new OperationError(
            outcomeError("not-supported", "FHIR 4.3 is not supported"),
          );
        }
        case "4.0": {
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
                  ? (Object.values(
                      context.state.data[context.request.resourceType] || {},
                    ) as r4.Resource[])
                  : ((resourceTypes.length > 0
                      ? resourceTypes
                      : Object.keys(context.state.data)
                    )
                      .map((k) =>
                        Object.values(
                          context.state.data[k as r4.ResourceType] || {},
                        ),
                      )
                      .flat() as r4.Resource[]);

              let result = [];
              for (const resource of resourceSet || []) {
                // Performance opt and removes issue of recursion with search parameter queries.
                if (resource.resourceType === "SearchParameter") {
                  if (checkSearchParameter(resource, resourceParameters)) {
                    result.push(resource);
                  }
                } else if (
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
                result = result.slice(
                  parseInt(offsetParam.value[0].toString()),
                );
              }

              const countParam = parametersResult.find(
                (v) => v.name === "_count",
              );
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
                      fhirVersion: "4.0",
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
                      fhirVersion: "4.0",
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
                  fhirVersion: "4.0",
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
              const resources =
                context.state.data[context.request.resourceType];
              if (!resource?.id) resource.id = nanoid() as r4.id;

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
                  fhirVersion: "4.0",
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
                  fhirVersion: "4.0",
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
        }
      }
    },
  ]);
}

function createResolveCanonical(
  data: InternalData<r4.ResourceType>,
): <T extends r4.ResourceType>(
  type: T,
  url: string,
) => r4.AResource<T> | undefined {
  const map = new Map<r4.ResourceType, Map<string, string>>();
  for (const resourceType of Object.keys(data)) {
    for (const resource of Object.values(
      data[resourceType as r4.ResourceType] ?? {},
    )) {
      if ((resource as { url: string })?.url) {
        if (!map.has(resourceType as r4.ResourceType)) {
          map.set(resourceType as r4.ResourceType, new Map());
        }
        const url = (resource as { url: string }).url;
        const id = resource?.id;
        if (!map.get(resourceType as r4.ResourceType)?.has(url) && id) {
          map.get(resourceType as r4.ResourceType)?.set(url, id);
        }
      }
    }
  }

  return <T extends r4.ResourceType>(type: T, url: string) => {
    const id = map.get(type)?.get(url);
    return id ? (data[type]?.[id as r4.id] as r4.AResource<T>) : undefined;
  };
}

function createResolveTypeToCanonical(
  data: InternalData<r4.ResourceType>,
): (type: r4.uri) => r4.canonical | undefined {
  const map = new Map<r4.uri, r4.canonical>();
  const sds: Record<r4.id, r4.StructureDefinition | undefined> = data[
    "StructureDefinition"
  ] as Record<r4.id, r4.StructureDefinition | undefined>;

  for (const resource of Object.values(sds || {})) {
    if (resource?.type && resource?.url) {
      map.set(resource.type, resource.url as r4.canonical);
    }
  }

  return (type: r4.uri) => {
    return map.get(type);
  };
}

interface MemoryClientInterface<CTX> extends FHIRClientAsync<CTX> {
  resolveCanonical: ReturnType<typeof createResolveCanonical>;
  resolveTypeToCanonical: ReturnType<typeof createResolveTypeToCanonical>;
}

class Memory<CTX extends FHIRServerCTX> implements MemoryClientInterface<CTX> {
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
  public resolveCanonical: MemoryClientInterface<CTX>["resolveCanonical"];
  public resolveTypeToCanonical: MemoryClientInterface<CTX>["resolveTypeToCanonical"];

  constructor(data: InternalData<r4.ResourceType>) {
    const client = new AsynchronousClient<
      { data: InternalData<r4.ResourceType> },
      CTX
    >({ data: data }, createMemoryMiddleware());

    this._client = client;
    this.request = this._client.request.bind(this._client);
    this.capabilities = this._client.capabilities.bind(this._client);

    this.search_system = this._client.search_system.bind(this._client);
    this.search_type = this._client.search_type.bind(this._client);

    this.create = this._client.create.bind(this._client);
    this.update = this._client.update.bind(this._client);
    this.patch = this._client.patch.bind(this._client);
    this.read = this._client.read.bind(this._client);
    this.vread = this._client.vread.bind(this._client);
    this.delete = this._client.delete.bind(this._client);

    this.historySystem = this._client.historySystem.bind(this._client);
    this.historyType = this._client.historyType.bind(this._client);
    this.historyInstance = this._client.historyInstance.bind(this._client);

    this.invoke_system = this._client.invoke_system.bind(this._client);
    this.invoke_type = this._client.invoke_type.bind(this._client);
    this.invoke_instance = this._client.invoke_instance.bind(this._client);

    this.transaction = this._client.transaction.bind(this._client);
    this.batch = this._client.batch.bind(this._client);

    this.resolveCanonical = createResolveCanonical(data);
    this.resolveTypeToCanonical = createResolveTypeToCanonical(data);
  }
}

export default function createMemoryDatabaseFromData<CTX extends FHIRServerCTX>(
  data: InternalData<r4.ResourceType>,
): Memory<CTX> {
  return new Memory(data);
}

export function createArtifactMemoryDatabase<CTX extends FHIRServerCTX>(
  fhirVersion: "4.0",
  resourceTypes: r4.ResourceType[],
): Memory<CTX> {
  const artifactResources: r4.Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        fhirVersion: fhirVersion,
        resourceType,
        packageLocation: path.join(
          fileURLToPath(import.meta.url),
          "../../../../../",
        ),
      }),
    )
    .flat();
  let data: InternalData<r4.ResourceType> = {};
  for (const resource of artifactResources) {
    data = {
      ...data,
      [resource.resourceType]: {
        ...data[resource.resourceType],
        [resource.id as r4.id]: resource,
      },
    };
  }

  return createMemoryDatabaseFromData(data);
}
