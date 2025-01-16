import { Kafka, logLevel } from "kafkajs";
import * as s from "zapatos/schema";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { createClient, createLogger } from "../../../fhir-server/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../fhir-terminology/index.js";
import createQueue from "../../../queue/index.js";
import * as queue from "../../../queue/interface.js";
import {
  OperationsTopic,
  TOPIC_PATTERN,
} from "../../../queue/topics/tenants.js";
import createResourceStore from "../../../storage/resource-stores/index.js";
import { createSearchStore } from "../../../storage/search-stores/index.js";
import { toFHIRVersion } from "../../../storage/utilities/version.js";
import { gateMutation } from "../utilities.js";

async function handleMutation(
  ctx: Omit<IGUHealthServerCTX, "user" | "tenant">,
  mutation: queue.Operations[number],
) {
  if (gateMutation("resources", "create", mutation)) {
    if (mutation.value.deleted === true) {
      const resource = mutation.value.resource as unknown as Resource<
        FHIR_VERSION,
        AllResourceTypes
      >;
      if (!resource.id) {
        throw new Error("Resource ID is required for DELETE operation");
      }
      await ctx.search.removeIndex(
        asRoot({
          ...ctx,
          tenant: mutation.value.tenant as TenantId,
        }),
        toFHIRVersion(mutation.value.fhir_version as s.fhir_version),
        resource.id,
        resource.resourceType,
      );
    } else {
      await ctx.search.index(
        asRoot({
          ...ctx,
          tenant: mutation.value.tenant as TenantId,
        }),
        toFHIRVersion(mutation.value.fhir_version as s.fhir_version),
        mutation.value.resource as unknown as Resource<
          FHIR_VERSION,
          AllResourceTypes
        >,
      );
    }
  }
}

export default async function createIndexingWorker() {
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: process.env.QUEUE_BROKERS?.split(",") ?? [],
    clientId: process.env.QUEUE_CLIENT_ID,
  });

  const iguhealthServices: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    queue: await createQueue(),
    store: await createResourceStore({ type: "postgres" }),
    search: await createSearchStore({ type: "postgres" }),
    logger: createLogger(),
    terminologyProvider: new TerminologyProvider(),
    ...createClient(),
  };

  const consumer = kafka.consumer({ groupId: "resource-search-indexing" });
  await consumer.connect();
  await consumer.subscribe({
    topic: TOPIC_PATTERN(OperationsTopic),
    fromBeginning: true,
  });
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        iguhealthServices.logger.info(
          `[Indexing], Processing message ${message.key?.toString()}`,
        );

        if (message.value) {
          const mutations: queue.Operations = JSON.parse(
            message.value.toString(),
          );
          for (const mutation of mutations) {
            await handleMutation(iguhealthServices, mutation);
          }
        }

        // Run manual commit to avoid reprocessing.
        // Read https://kafka.js.org/docs/consuming#a-name-manual-commits-a-manual-committing
        // Use + 1 on offset per above.
        await consumer.commitOffsets([
          { topic, partition, offset: (Number(message.offset) + 1).toString() },
        ]);

        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}`);
      } catch (e) {
        console.error(e);
      }
    },
  });

  return async () => {
    await consumer.disconnect();
    process.exit(0);
  };
}
