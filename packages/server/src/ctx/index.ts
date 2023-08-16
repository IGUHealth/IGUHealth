import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  ResourceType,
  Resource,
  CapabilityStatement,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientSync } from "@iguhealth/client/lib/interface.js";

import { createPostgresClient } from "../resourceProviders/postgres/index.js";
import { FHIRServerCTX } from "../fhirServer.js";
import MemoryDatabase from "../resourceProviders/memory.js";
import RouterClient from "../resourceProviders/router.js";
import PostgresLock from "../synchronization/postgres.lock.js";
import LambdaExecutioner from "../operation-executors/awsLambda.js";

const MEMORY_TYPES = ["StructureDefinition", "SearchParameter"];

function createMemoryDatabase(
  resourceTypes: ResourceType[]
): FHIRClientSync<any> {
  const database = MemoryDatabase<any>({});
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(
        resourceType,
        path.join(fileURLToPath(import.meta.url), "../../")
      )
    )
    .flat();
  for (const resource of artifactResources) {
    database.create({}, resource);
  }
  return database;
}

function serverCapabilities(): CapabilityStatement {
  return {
    resourceType: "CapabilityStatement",
    status: "active",
    date: new Date().toDateString(),
    fhirVersion: "r4",
    kind: "capability",
    format: ["json"],
  };
}

export default function createServiceCTX(): Pick<
  FHIRServerCTX,
  "lock" | "client" | "resolveSD" | "capabilities"
> {
  const memoryDatabase = createMemoryDatabase([
    "StructureDefinition",
    "SearchParameter",
  ]);

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
      resourcesSupported: MEMORY_TYPES as ResourceType[],
      interactionsSupported: ["read-request", "search-request"],
      source: memoryDatabase,
    },
    {
      resourcesSupported: [...resourceTypes].filter(
        (type) => MEMORY_TYPES.indexOf(type) === -1
      ) as ResourceType[],
      interactionsSupported: [
        "read-request",
        "search-request",
        "create-request",
        "update-request",
        "delete-request",
      ],
      source: createPostgresClient({
        user: process.env["FHIR_DATABASE_USERNAME"],
        password: process.env["FHIR_DATABASE_PASSWORD"],
        host: process.env["FHIR_DATABASE_HOST"],
        database: process.env["FHIR_DATABASE_NAME"],
        port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
      }),
    },
  ]);

  const services = {
    capabilities: serverCapabilities(),
    client,
    resolveSD: (ctx: FHIRServerCTX, type: string) =>
      memoryDatabase.read(ctx, "StructureDefinition", type),
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
