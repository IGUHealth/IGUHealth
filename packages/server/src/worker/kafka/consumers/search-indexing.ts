import * as s from "zapatos/schema";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { toFHIRVersion } from "../../../fhir-clients/utilities/version.js";
import { createClient, createLogger } from "../../../fhir-server/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../fhir-terminology/index.js";
import createQueue from "../../../queue/index.js";
import * as queue from "../../../queue/interface.js";
import {
  IConsumerGroupID,
  OperationsTopic,
  TENANT_TOPIC_PATTERN,
} from "../../../queue/topics/index.js";
import createResourceStore from "../../../resource-stores/index.js";
import { createSearchStore } from "../../../search-stores/index.js";
import createKafkaConsumer from "../local.js";
import { MessageHandler } from "../types.js";
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

const handler: MessageHandler<
  Omit<IGUHealthServerCTX, "user" | "tenant">
> = async (iguhealthServices, { message }) => {
  iguhealthServices.logger.info(
    `[Indexing], Processing message ${message.key?.toString()}`,
  );

  if (message.value) {
    const mutations: queue.Operations = JSON.parse(message.value.toString());
    for (const mutation of mutations) {
      await handleMutation(iguhealthServices, mutation);
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
    "indexing" as IConsumerGroupID,
    async (ctx, { topic, partition, message }) => {
      try {
        await handler(ctx, { message, topic, partition });
      } catch (e) {
        console.error(e);
      }
    },
  );

  return stop;
}
