import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";

import { createClient, createLogger } from "../../../fhir-server/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../fhir-terminology/index.js";
import createQueue from "../../../queue/index.js";
import * as queue from "../../../queue/interface.js";
import {
  Consumers,
  OperationsTopic,
  TENANT_TOPIC_PATTERN,
} from "../../../queue/topics/index.js";
import createResourceStore from "../../../resource-stores/index.js";
import { createSearchStore } from "../../../search-stores/index.js";
import createKafkaConsumer from "../local.js";
import { MessageHandler } from "../types.js";
import { getTenantId } from "../utilities.js";

async function handleMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.Operations[number],
) {
  switch (true) {
    case queue.isOperationType("create", mutation):
    case queue.isOperationType("update", mutation):
    case queue.isOperationType("patch", mutation): {
      await ctx.search.index(
        asRoot(ctx),
        mutation.response.fhirVersion,
        mutation.response.body,
      );
      return;
    }
    case queue.isOperationType("delete", mutation): {
      switch (mutation.response.level) {
        case "instance": {
          await ctx.search.removeIndex(
            asRoot(ctx),
            mutation.response.fhirVersion,
            mutation.response.id,
            mutation.response.resource,
          );
          return;
        }
        case "type":
        case "system": {
          await Promise.all(
            (mutation.response.deletion ?? []).map(async (r) => {
              await ctx.search.removeIndex(
                asRoot(ctx),
                mutation.response.fhirVersion,
                r.id as id,
                r.resourceType,
              );
            }),
          );
        }
      }
    }
  }
}

const handler: MessageHandler<
  Omit<IGUHealthServerCTX, "user" | "tenant">
> = async (iguhealthServices, { message }) => {
  iguhealthServices.logger.info(
    `[Indexing], Processing message ${message.key?.toString()}`,
  );

  const tenantId = getTenantId(message);

  if (message.value) {
    const mutations: queue.Operations = JSON.parse(message.value.toString());
    for (const mutation of mutations) {
      await handleMutation(
        { ...iguhealthServices, tenant: tenantId },
        mutation,
      );
    }
  }
};

export default async function createIndexingWorker() {
  const iguhealthServices: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    queue: await createQueue(),
    store: await createResourceStore({ type: "postgres" }),
    search: await createSearchStore({ type: "postgres" }),
    logger: createLogger(),
    terminologyProvider: new TerminologyProvider(),
    ...createClient(),
  };

  const stop = await createKafkaConsumer(
    iguhealthServices,
    TENANT_TOPIC_PATTERN(OperationsTopic),
    Consumers.SearchIndexing,
    {
      eachMessage: async (ctx, { topic, partition, message }) => {
        try {
          await handler(ctx, { message, topic, partition });
        } catch (e) {
          console.error(e);
        }
      },
    },
  );

  return stop;
}
