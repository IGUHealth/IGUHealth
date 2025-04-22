import { fileURLToPath } from "node:url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRResponse } from "@iguhealth/client/lib/types";
import {
  SearchParameterResource,
  SearchParameterResult,
} from "@iguhealth/client/lib/url";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import {
  deriveResourceTypeFilter,
  parametersWithMetaAssociated,
} from "../../../search-stores/parameters.js";
import { generateId } from "../../utilities/generateId.js";
import { fitsSearchCriteria } from "./search.js";
import { InternalData } from "./types.js";

function checkSearchParameter<Version extends FHIR_VERSION>(
  searchParameter: Resource<Version, "SearchParameter">,
  resourceParameters: SearchParameterResource<Version>[],
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

        if (
          !valuesToCheck.some((v) =>
            resourceParameter.value.includes(v as string | number),
          )
        )
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

function getVersionedDB<Version extends FHIR_VERSION>(
  data: MemoryData,
  fhirVersion: Version,
): Record<
  AllResourceTypes,
  Record<r4.id, Resource<Version, AllResourceTypes>>
> {
  return data[fhirVersion] as Record<
    AllResourceTypes,
    Record<r4.id, Resource<Version, AllResourceTypes>>
  >;
}

function getResourcesOfType<
  Version extends FHIR_VERSION,
  T extends AllResourceTypes,
>(
  data: MemoryData,
  fhirVersion: Version,
  type: T,
): Record<r4.id, Resource<Version, T>> {
  const versionedDb = getVersionedDB(data, fhirVersion);
  const resources = versionedDb[type] ?? {};

  return resources as Record<r4.id, Resource<Version, T>>;
}

function setResource<Version extends FHIR_VERSION>(
  data: MemoryData,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes> & { id: r4.id },
): MemoryData {
  // Return new object on mutation.
  return {
    ...data,
    [fhirVersion]: {
      ...data[fhirVersion],
      [resource.resourceType]: {
        ...data[fhirVersion][resource.resourceType],
        [resource.id]: resource,
      },
    },
  };
}

function createMemoryMiddleware<
  State extends { data: MemoryData },
  CTX extends IGUHealthServerCTX,
>(state: State): MiddlewareAsync<CTX> {
  return createMiddlewareAsync<State, CTX>(state, [
    async (state, context) => {
      /* eslint-disable no-fallthrough */
      switch (context.request.type) {
        case "search-request": {
          switch (context.request.level) {
            case "system": {
              // For system searches going to skip.
              return [
                state,
                {
                  ...context,
                  response: {
                    fhirVersion: context.request.fhirVersion,
                    level: context.request.level,
                    parameters: context.request.parameters,
                    type: "search-response",
                    body: {
                      type: "searchset" as r4.code,
                      resourceType: "Bundle",
                      entry: [],
                    },
                  } as FHIRResponse<FHIR_VERSION, "search">,
                },
              ];
            }
            case "type": {
              const resourceTypes = deriveResourceTypeFilter(context.request);
              // Remove _type as using on derived resourceTypeFilter
              context.request.parameters = context.request.parameters.filter(
                (p) => p.name !== "_type",
              );

              const parameters = await parametersWithMetaAssociated(
                context.ctx,
                context.request.fhirVersion,
                resourceTypes,
                context.request.parameters,
              );

              // Standard parameters
              const resourceParameters = parameters.filter(
                (v): v is SearchParameterResource<FHIR_VERSION> =>
                  v.type === "resource",
              );

              const resourceSet = Object.values(
                getResourcesOfType(
                  state.data,
                  context.request.fhirVersion,
                  context.request.resource,
                ),
              );
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
                    context.request.fhirVersion,
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
              return [
                state,
                {
                  ...context,
                  response: {
                    fhirVersion: context.request.fhirVersion,
                    resource: context.request.resource,
                    level: "type",
                    parameters: context.request.parameters,
                    type: "search-response",
                    body: {
                      type: "searchset",
                      resourceType: "Bundle",
                      entry: result.map((r) => ({ resource: r })),
                    },
                  } as FHIRResponse<FHIR_VERSION, "search">,
                },
              ];
            }
            default: {
              throw new OperationError(
                outcomeError(
                  "not-supported",
                  `Search level not supported for level`,
                ),
              );
            }
          }
        }
        case "update-request": {
          const resource = context.request.body;
          if (!resource.id)
            throw new OperationError(
              outcomeError("invalid", "Updated resource must have an id."),
            );

          return [
            {
              ...state,
              data: setResource(
                state.data,
                context.request.fhirVersion,
                resource as Parameters<typeof setResource>[2],
              ),
            },
            {
              ...context,
              response: {
                fhirVersion: context.request.fhirVersion,
                level: "instance",
                type: "update-response",
                resource: context.request.resource,
                id: resource.id,
                body: resource as Resource<
                  typeof context.request.fhirVersion,
                  AllResourceTypes
                >,
              } as FHIRResponse<FHIR_VERSION, "update">,
            },
          ];
        }
        case "create-request": {
          const resource = context.request.body;
          if (!resource?.id) resource.id = generateId();
          return [
            {
              ...state,
              data: setResource(
                state.data,
                context.request.fhirVersion,
                resource as Parameters<typeof setResource>[2],
              ),
            },
            {
              ...context,

              response: {
                fhirVersion: context.request.fhirVersion,
                level: "type",
                type: "create-response",
                resource: context.request.resource,
                body: resource as Resource<
                  typeof context.request.fhirVersion,
                  AllResourceTypes
                >,
              } as FHIRResponse<FHIR_VERSION, "create">,
            },
          ];
        }
        case "read-request": {
          const resource =
            state.data[context.request.fhirVersion][context.request.resource]?.[
              context.request.id
            ];
          if (!resource) {
            throw new Error(
              `Not found resource of type '${context.request.resource}' with id '${context.request.id}'`,
            );
          }
          return [
            state,
            {
              ...context,
              response: {
                fhirVersion: context.request.fhirVersion,
                level: "instance",
                type: "read-response",
                resource: context.request.resource,
                id: context.request.id,
                body: resource as Resource<
                  typeof context.request.fhirVersion,
                  AllResourceTypes
                >,
              } as FHIRResponse<FHIR_VERSION, "read">,
            },
          ];
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

function createURLMap<Version extends FHIR_VERSION>(
  memoryData: MemoryData,
  fhirVersion: Version,
): Map<AllResourceTypes, Map<string, string>> {
  const versionedMap = new Map();
  const data = getVersionedDB(memoryData, fhirVersion);
  for (const resourceType of Object.keys(data)) {
    for (const resource of Object.values(
      data[resourceType as ResourceType<Version>] ?? {},
    )) {
      if ((resource as { url: string })?.url) {
        if (!versionedMap.has(resourceType as r4.ResourceType)) {
          versionedMap.set(resourceType as r4.ResourceType, new Map());
        }
        const url = (resource as { url: string }).url;
        const id = resource?.id;
        if (
          !versionedMap.get(resourceType as r4.ResourceType)?.has(url) &&
          id
        ) {
          versionedMap.get(resourceType as r4.ResourceType)?.set(url, id);
        }
      }
    }
  }

  return versionedMap;
}

function resolveCanonical<
  Version extends FHIR_VERSION,
  Type extends ResourceType<Version>,
>(
  fhirVersion: Version,
  type: Type,
  data: MemoryData,
  versionedMap: Map<AllResourceTypes, Map<string, string>>,
  url: r4.canonical,
): Resource<Version, Type> | undefined {
  const id = versionedMap.get(type)?.get(url);

  return (
    id ? getResourcesOfType(data, fhirVersion, type)?.[id as r4.id] : undefined
  ) as Resource<Version, Type>;
}

function createResolveCanonical(
  data: MemoryData,
): IGUHealthServerCTX["resolveCanonical"] {
  const r4Map = createURLMap(data, R4);
  const r4bMap = createURLMap(data, R4B);

  return async <
    Version extends FHIR_VERSION,
    Type extends ResourceType<Version>,
    URL extends r4.canonical | r4.canonical[],
    Return extends URL extends r4.canonical[]
      ? Resource<Version, Type>[]
      : Resource<Version, Type> | undefined,
  >(
    ctx: IGUHealthServerCTX,
    fhirVersion: Version,
    type: Type,
    url: URL,
  ): Promise<Return> => {
    const versionedMap = fhirVersion === R4 ? r4Map : r4bMap;
    if (Array.isArray(url)) {
      return url
        .map((url) =>
          resolveCanonical(fhirVersion, type, data, versionedMap, url),
        )
        .filter((r) => r !== undefined) as unknown as Return;
    }

    return resolveCanonical(
      fhirVersion,
      type,
      data,
      versionedMap,
      url,
    ) as unknown as Return;
  };
}

interface MemoryClientInterface<CTX> extends FHIRClientAsync<CTX> {
  resolveCanonical: ReturnType<typeof createResolveCanonical>;
}

type MemoryData = {
  [R4]: InternalData<R4, AllResourceTypes>;
  [R4B]: InternalData<R4B, AllResourceTypes>;
};

export class Memory<CTX extends IGUHealthServerCTX>
  implements MemoryClientInterface<CTX>
{
  private readonly _client;

  public request: FHIRClientAsync<CTX>["request"];
  public capabilities: FHIRClientAsync<CTX>["capabilities"];
  public search_system: FHIRClientAsync<CTX>["search_system"];
  public search_type: FHIRClientAsync<CTX>["search_type"];
  public create: FHIRClientAsync<CTX>["create"];
  public update: FHIRClientAsync<CTX>["update"];
  public conditionalUpdate: FHIRClientAsync<CTX>["conditionalUpdate"];
  public patch: FHIRClientAsync<CTX>["patch"];
  public read: FHIRClientAsync<CTX>["read"];
  public vread: FHIRClientAsync<CTX>["vread"];
  public delete_instance: FHIRClientAsync<CTX>["delete_instance"];
  public delete_type: FHIRClientAsync<CTX>["delete_type"];
  public delete_system: FHIRClientAsync<CTX>["delete_system"];
  public history_system: FHIRClientAsync<CTX>["history_system"];
  public history_type: FHIRClientAsync<CTX>["history_type"];
  public history_instance: FHIRClientAsync<CTX>["history_instance"];
  public invoke_system: FHIRClientAsync<CTX>["invoke_system"];
  public invoke_type: FHIRClientAsync<CTX>["invoke_type"];
  public invoke_instance: FHIRClientAsync<CTX>["invoke_instance"];
  public transaction: FHIRClientAsync<CTX>["transaction"];
  public batch: FHIRClientAsync<CTX>["batch"];

  public resolveCanonical: MemoryClientInterface<CTX>["resolveCanonical"];

  constructor(partialData: Partial<MemoryData>) {
    const data: MemoryData = {
      [R4]: {},
      [R4B]: {},
      ...partialData,
    };
    const client = new AsynchronousClient<CTX>(
      createMemoryMiddleware({ data }),
    );

    this._client = client;
    this.request = this._client.request.bind(this._client);
    this.capabilities = this._client.capabilities.bind(this._client);

    this.search_system = this._client.search_system.bind(this._client);
    this.search_type = this._client.search_type.bind(this._client);

    this.create = this._client.create.bind(this._client);
    this.update = this._client.update.bind(this._client);
    this.conditionalUpdate = this._client.conditionalUpdate.bind(this._client);
    this.patch = this._client.patch.bind(this._client);
    this.read = this._client.read.bind(this._client);
    this.vread = this._client.vread.bind(this._client);
    this.delete_instance = this._client.delete_instance.bind(this._client);
    this.delete_type = this._client.delete_type.bind(this._client);
    this.delete_system = this._client.delete_system.bind(this._client);

    this.history_system = this._client.history_system.bind(this._client);
    this.history_type = this._client.history_type.bind(this._client);
    this.history_instance = this._client.history_instance.bind(this._client);

    this.invoke_system = this._client.invoke_system.bind(this._client);
    this.invoke_type = this._client.invoke_type.bind(this._client);
    this.invoke_instance = this._client.invoke_instance.bind(this._client);

    this.transaction = this._client.transaction.bind(this._client);
    this.batch = this._client.batch.bind(this._client);

    this.resolveCanonical = createResolveCanonical(data);
  }
}

export type MemoryParameter = Partial<Parameters<typeof loadArtifacts>[0]> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resourceType: any;
};

export function createArtifactMemoryDatabase<CTX extends IGUHealthServerCTX>({
  r4,
  r4b,
}: {
  r4: MemoryParameter[];
  r4b: MemoryParameter[];
}): Memory<CTX> {
  const r4Resources: r4.Resource[] = r4
    .map((config) =>
      loadArtifacts({
        fhirVersion: R4,
        silence: true,
        currentDirectory: fileURLToPath(import.meta.url),
        ...config,
      }),
    )
    .flat();

  const r4Data: InternalData<R4, r4.ResourceType> = r4Resources.reduce(
    (r4Data: InternalData<R4, r4.ResourceType>, resource) => ({
      ...r4Data,
      [resource.resourceType]: {
        ...r4Data[resource.resourceType],
        [resource.id as r4.id]: resource,
      },
    }),
    {},
  );

  const r4bResources: r4b.Resource[] = r4b
    .map((config) =>
      loadArtifacts({
        fhirVersion: R4B,
        silence: true,
        currentDirectory: fileURLToPath(import.meta.url),
        ...config,
      }),
    )
    .flat();

  const r4bData: InternalData<R4B, r4b.ResourceType> = r4bResources.reduce(
    (r4bData: InternalData<R4B, r4b.ResourceType>, resource) => ({
      ...r4bData,
      [resource.resourceType]: {
        ...r4bData[resource.resourceType],
        [resource.id as r4.id]: resource,
      },
    }),
    {},
  );

  return new Memory({
    [R4]: r4Data,
    [R4B]: r4bData,
  });
}
