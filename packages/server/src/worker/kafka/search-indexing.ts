import { Kafka, logLevel } from "kafkajs";
import * as s from "zapatos/schema";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { createClient, createLogger } from "../../fhir-api/index.js";
import { IGUHealthServerCTX, asRoot } from "../../fhir-api/types.js";
import { createPGPool } from "../../fhir-storage/pg.js";
import createResourceStore from "../../fhir-storage/resource-stores/index.js";
import { createSearchStore } from "../../fhir-storage/search-stores/index.js";
import { toFHIRVersion } from "../../fhir-storage/utilities/version.js";
import { TerminologyProvider } from "../../fhir-terminology/index.js";
import { associateVersionIdFromKafkaMessage } from "./utilities.js";

export default async function createIndexingWorker() {
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: process.env.KAFKA_BROKERS?.split(",") ?? [],
    clientId: process.env.KAFKA_CLIENT_ID,
  });

  const iguhealthServices: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    db: createPGPool(),
    store: await createResourceStore({ type: "postgres" }),
    search: await createSearchStore({ type: "postgres" }),
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
          partition,
          message,
          JSON.parse(message.value.toString()),
        );

        if (value.deleted === true) {
          const resource = value.resource as unknown as Resource<
            FHIR_VERSION,
            AllResourceTypes
          >;
          if (!resource.id) {
            throw new Error("Resource ID is required for DELETE operation");
          }
          await iguhealthServices.search.removeIndex(
            asRoot({
              ...iguhealthServices,
              tenant: value.tenant as TenantId,
            }),
            toFHIRVersion(value.fhir_version as s.fhir_version),
            resource.id,
            resource.resourceType,
          );
        } else {
          await iguhealthServices.search.index(
            asRoot({
              ...iguhealthServices,
              tenant: value.tenant as TenantId,
            }),
            toFHIRVersion(value.fhir_version as s.fhir_version),
            value.resource as unknown as Resource<
              FHIR_VERSION,
              AllResourceTypes
            >,
          );
        }
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
