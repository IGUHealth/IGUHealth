import path from "path";
import { fileURLToPath } from "url";
import createLogger from "pino";

import { loadArtifacts } from "@iguhealth/artifacts";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  id,
  ResourceType,
  Resource,
  CapabilityStatement,
  CapabilityStatementRestResource,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientSync, FHIRClientAsync } from "@iguhealth/client/interface";

import { createPostgresClient } from "../resourceProviders/postgres/index.js";
import { FHIRServerCTX } from "../fhirServer.js";
import { InternalData } from "../resourceProviders/memory/types.js";
import MemoryDatabaseAsync from "../resourceProviders/memory/async.js";
import MemoryDatabaseSync from "../resourceProviders/memory/sync.js";
import RouterClient from "../resourceProviders/router.js";
import PostgresLock from "../synchronization/postgres.lock.js";
import LambdaExecutioner from "../operation-executors/awsLambda.js";
import RedisCache from "../cache/redis.js";

const MEMORY_TYPES: ResourceType[] = [
  "StructureDefinition",
  "SearchParameter",
  "ValueSet",
  "CodeSystem",
];

function createMemoryData(
  resourceTypes: ResourceType[]
): InternalData<ResourceType> {
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(
        resourceType,
        path.join(fileURLToPath(import.meta.url), "../../../")
      )
    )
    .flat();
  let data: InternalData<ResourceType> = {};
  for (const resource of artifactResources) {
    data = {
      ...data,
      [resource.resourceType]: {
        ...data[resource.resourceType],
        [resource.id as id]: resource,
      },
    };
  }

  return data;
}

async function createResourceRestCapabilities(
  memdb: FHIRClientAsync<any>,
  sd: StructureDefinition
): Promise<CapabilityStatementRestResource> {
  const resourceParameters = await memdb.search_type({}, "SearchParameter", [
    {
      name: "base",
      value: ["Resource", "DomainResource", sd.type],
    },
    {
      name: "_count",
      value: [1000],
    },
  ]);

  return {
    type: sd.type,
    profile: sd.url,
    interaction: [
      { code: "read" },
      { code: "update" },
      { code: "delete" },
      { code: "search-type" },
      { code: "create" },
      { code: "history-instance" },
    ],
    versioning: "versioned",
    updateCreate: false,
    searchParam: resourceParameters.resources.map((resource) => ({
      name: resource.name,
      definition: resource.url,
      type: resource.type,
      documentation: resource.description,
    })),
  };
}

async function serverCapabilities(
  memdb: FHIRClientAsync<any>
): Promise<CapabilityStatement> {
  const sds = (
    await memdb.search_type({}, "StructureDefinition", [
      {
        name: "_count",
        value: [1000],
      },
    ])
  ).resources.filter((sd) => sd.abstract === false && sd.kind === "resource");

  const rootParameters = await memdb.search_type({}, "SearchParameter", [
    {
      name: "base",
      value: ["Resource", "DomainResource"],
    },
    {
      name: "_count",
      value: [1000],
    },
  ]);
  return {
    resourceType: "CapabilityStatement",
    status: "active",
    fhirVersion: "4.0",
    date: new Date().toISOString(),
    kind: "capability",
    format: ["json"],
    rest: [
      {
        mode: "server",
        security: {
          cors: true,
          service: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/restful-security-service",
                  code: "OAuth",
                  display: "OAuth",
                },
              ],
            },
          ],
        },
        interaction: [{ code: "search-system" }],
        searchParam: rootParameters.resources.map((resource) => ({
          name: resource.name,
          definition: resource.url,
          type: resource.type,
          documentation: resource.description,
        })),
        resource: await Promise.all(
          sds.map((sd) => createResourceRestCapabilities(memdb, sd))
        ),
      },
    ],
  };
}

export default async function createServiceCTX(): Promise<
  Pick<
    FHIRServerCTX,
    "lock" | "client" | "resolveSD" | "capabilities" | "cache" | "logger"
  >
> {
  const memDBAsync = MemoryDatabaseAsync(createMemoryData(MEMORY_TYPES));
  const memDBSync = MemoryDatabaseSync(createMemoryData(MEMORY_TYPES));

  const client = RouterClient([
    // OP INVOCATION
    {
      resourcesSupported: [...resourceTypes] as ResourceType[],
      interactionsSupported: ["invoke-request"],
      source: LambdaExecutioner({
        AWS_REGION: process.env.AWS_REGION as string,
        AWS_ACCESS_KEY_ID: process.env.AWS_LAMBDA_ACCESS_KEY_ID as string,
        AWS_ACCESS_KEY_SECRET: process.env
          .AWS_LAMBDA_ACCESS_KEY_SECRET as string,
        LAMBDA_ROLE: process.env.AWS_LAMBDA_ROLE as string,
        LAYERS: [process.env.AWS_LAMBDA_LAYER_ARN as string],
      }),
    },
    {
      resourcesSupported: MEMORY_TYPES,
      interactionsSupported: ["read-request", "search-request"],
      source: memDBSync, // memDBAsync,
    },
    {
      resourcesSupported: [...resourceTypes].filter(
        (type) => MEMORY_TYPES.indexOf(type as ResourceType) === -1
      ) as ResourceType[],
      interactionsSupported: [
        "read-request",
        "search-request",
        "create-request",
        "update-request",
        "delete-request",
        "history-request",
      ],
      source: createPostgresClient({
        user: process.env["FHIR_DATABASE_USERNAME"],
        password: process.env["FHIR_DATABASE_PASSWORD"],
        host: process.env["FHIR_DATABASE_HOST"],
        database: process.env["FHIR_DATABASE_NAME"],
        port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
        ssl: process.env["FHIR_DATABASE_SSL"] === "true",
      }),
    },
  ]);

  const services = {
    logger: createLogger.default(),
    capabilities: await serverCapabilities(memDBAsync),
    client,
    cache: new RedisCache({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6739"),
    }),
    resolveSD: (ctx: FHIRServerCTX, type: string) =>
      memDBSync.read(ctx, "StructureDefinition", type),
    lock: new PostgresLock({
      user: process.env["FHIR_DATABASE_USERNAME"],
      password: process.env["FHIR_DATABASE_PASSWORD"],
      host: process.env["FHIR_DATABASE_HOST"],
      database: process.env["FHIR_DATABASE_NAME"],
      port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
    }),
  };

  return services;
}
