import { Kafka, logLevel } from "kafkajs";

import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { createClient, createLogger } from "../../fhir-api/index.js";
import { IGUHealthServerCTX, asRoot } from "../../fhir-api/types.js";
import { createPGPool } from "../../fhir-storage/pg.js";
import { PostgresStore } from "../../fhir-storage/resource-stores/postgres.js";
import { PostgresSearchEngine } from "../../fhir-storage/search-stores/postgres/index.js";
import { TerminologyProvider } from "../../fhir-terminology/index.js";
import { associateVersionIdFromKafkaMessage } from "./utilities.js";

export default async function createIndexingWorker() {
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: ["localhost:9092"],
    clientId: "resource-indexing",
  });

  const iguhealthServices: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    db: createPGPool(),
    store: new PostgresStore(),
    search: new PostgresSearchEngine(),
    logger: createLogger(),
    terminologyProvider: new TerminologyProvider(),
    ...createClient(),
  };

  const topic = "resources";
  const consumer = kafka.consumer({ groupId: "resource-search-indexing" });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.value) {
        const value = associateVersionIdFromKafkaMessage(
          message,
          JSON.parse(message.value.toString()),
        );

        await iguhealthServices.search.index(
          asRoot({
            ...iguhealthServices,
            tenant: value.tenant as TenantId,
          }),
          value.fhir_version === "r4" ? R4 : R4B,
          value.resource as unknown as Resource<FHIR_VERSION, AllResourceTypes>,
        );
      }

      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix} ${message.key}`);
    },
  });

  return async () => {
    await consumer.disconnect();
    process.exit(0);
  };
}
