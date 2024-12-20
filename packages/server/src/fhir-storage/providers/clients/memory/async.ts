import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRResponse } from "@iguhealth/client/lib/types";
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

import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import { generateId } from "../../../utilities/generateId.js";
import {
  SearchParameterResource,
  SearchParameterResult,
  deriveResourceTypeFilter,
  parametersWithMetaAssociated,
} from "../../../utilities/search/parameters.js";
import { fitsSearchCriteria } from "./search.js";
import { InternalData } from "./types.js";

// Need special handling of SearchParameter to avoid infinite recursion.
async function resolveParameter<Version extends FHIR_VERSION>(
  memoryData: MemoryData,
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
  name: string,
) {
  const data = memoryData[fhirVersion];
  const params = Object.values(data?.["SearchParameter"] || {}).filter(
    (p): p is r4.SearchParameter =>
      p?.resourceType === "SearchParameter" &&
      p?.name === name &&
      p?.base?.some((b: unknown) =>
        resourceTypes.includes(b as ResourceType<Version>),
      ),
  );

  return params;
}

function checkSearchParameter(
  searchParameter: Resource<FHIR_VERSION, "SearchParameter">,
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

function getResourceType<
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
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      /* eslint-disable no-fallthrough */
      switch (context.request.type) {
        case "search-request": {
          switch (context.request.level) {
            case "system": {
              // For system searches going to skip.
              return {
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
                } as FHIRResponse,
              };
            }
            case "type": {
              const resourceTypes = deriveResourceTypeFilter(context.request);
              // Remove _type as using on derived resourceTypeFilter
              context.request.parameters = context.request.parameters.filter(
                (p) => p.name !== "_type",
              );

              const parameters = await parametersWithMetaAssociated(
                async (resourceTypes, name) =>
                  resolveParameter(
                    context.state.data,
                    context.request.fhirVersion,
                    resourceTypes,
                    name,
                  ),
                resourceTypes,
                context.request.parameters,
              );

              // Standard parameters
              const resourceParameters = parameters.filter(
                (v): v is SearchParameterResource => v.type === "resource",
              );

              const resourceSet = Object.values(
                getResourceType(
                  context.state.data,
                  context.request.fhirVersion,
                  context.request.resource,
                ),
              );
              // : ((resourceTypes.length > 0
              //     ? resourceTypes
              //     : Object.keys(
              //         context.state.data[context.request.fhirVersion],
              //       )
              //   )
              //     .map((k) =>
              //       Object.values(
              //         context.state.data[context.request.fhirVersion][
              //           k as AllResourceTypes
              //         ] ?? {},
              //       ),
              //     )
              //     .flat() as r4.Resource[]);

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
              return {
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
                } as FHIRResponse,
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

          return {
            ...context,
            state: {
              ...context.state,
              data: setResource(
                context.state.data,
                context.request.fhirVersion,
                resource as Parameters<typeof setResource>[2],
              ),
            },
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
            } as FHIRResponse,
          };
        }
        case "create-request": {
          const resource = context.request.body;
          if (!resource?.id) resource.id = generateId();
          return {
            ...context,
            state: {
              ...context.state,
              data: setResource(
                context.state.data,
                context.request.fhirVersion,
                resource as Parameters<typeof setResource>[2],
              ),
            },
            response: {
              fhirVersion: context.request.fhirVersion,
              level: "type",
              type: "create-response",
              resource: context.request.resource,
              body: resource as Resource<
                typeof context.request.fhirVersion,
                AllResourceTypes
              >,
            } as FHIRResponse,
          };
        }
        case "read-request": {
          const resource =
            context.state.data[context.request.fhirVersion][
              context.request.resource
            ]?.[context.request.id];
          if (!resource) {
            throw new Error(
              `Not found resource of type '${context.request.resource}' with id '${context.request.id}'`,
            );
          }
          return {
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
            } as FHIRResponse,
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

function createResolveCanonical(
  data: MemoryData,
): IGUHealthServerCTX["resolveCanonical"] {
  const r4Map = createURLMap(data, R4);
  const r4bMap = createURLMap(data, R4B);

  return async <
    FHIRVersion extends FHIR_VERSION,
    Type extends AllResourceTypes,
  >(
    fhirVersion: FHIRVersion,
    type: Type,
    url: r4.canonical,
  ) => {
    const versionedMap = fhirVersion === R4 ? r4Map : r4bMap;

    const id = versionedMap.get(type)?.get(url);
    getResourceType(data, fhirVersion, type);

    return (
      id ? getResourceType(data, fhirVersion, type)?.[id as r4.id] : undefined
    ) as Resource<FHIRVersion, Type>;
  };
}

function createResolveTypeToCanonical(
  data: MemoryData,
): (version: FHIR_VERSION, type: r4.uri) => Promise<r4.canonical | undefined> {
  const r4Map = (
    Object.values(
      data?.[R4]?.["StructureDefinition"] ?? {},
    ) as r4.StructureDefinition[]
  ).reduce(
    (acc: Map<r4.uri, r4.canonical>, resource: r4.StructureDefinition) => {
      if (
        resource?.type &&
        resource?.url &&
        // Ignore profiles which will be constraints on the base definition.
        resource.derivation !== "constraint"
      ) {
        acc.set(resource.type, resource.url as r4.canonical);
      }
      return acc;
    },
    new Map(),
  );

  const r4bMap = (
    Object.values(
      data?.[R4B]?.["StructureDefinition"] ?? {},
    ) as r4b.StructureDefinition[]
  ).reduce(
    (acc: Map<r4b.uri, r4b.canonical>, resource: r4b.StructureDefinition) => {
      if (resource?.type && resource?.url) {
        acc.set(resource.type, resource.url as r4b.canonical);
      }
      return acc;
    },
    new Map(),
  );

  return async (version: FHIR_VERSION, type: r4.uri) => {
    switch (version) {
      case R4: {
        return r4Map.get(type);
      }
      case R4B: {
        return r4bMap.get(type);
      }
      default: {
        throw new OperationError(
          outcomeError("not-supported", "FHIR version not supported yet."),
        );
      }
    }
  };
}

interface MemoryClientInterface<CTX> extends FHIRClientAsync<CTX> {
  resolveCanonical: ReturnType<typeof createResolveCanonical>;
  resolveTypeToCanonical: ReturnType<typeof createResolveTypeToCanonical>;
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
  public resolveTypeToCanonical: MemoryClientInterface<CTX>["resolveTypeToCanonical"];

  constructor(partialData: Partial<MemoryData>) {
    const data: MemoryData = {
      [R4]: {},
      [R4B]: {},
      ...partialData,
    };
    const client = new AsynchronousClient<
      {
        data: MemoryData;
      },
      CTX
    >({ data }, createMemoryMiddleware());

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
    this.resolveTypeToCanonical = createResolveTypeToCanonical(data);
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
        packageLocation: path.join(
          fileURLToPath(import.meta.url),
          "../../../../../../",
        ),
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
        packageLocation: path.join(
          fileURLToPath(import.meta.url),
          "../../../../../../",
        ),
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
