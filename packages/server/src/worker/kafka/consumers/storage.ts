import { Kafka, logLevel } from "kafkajs";
import * as db from "zapatos/db";

import { TenantId } from "@iguhealth/jwt";

import createEmailProvider from "../../../email/index.js";
import { createClient, createLogger } from "../../../fhir-server/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../fhir-terminology/index.js";
import createQueue from "../../../queue/index.js";
import * as queue from "../../../queue/interface.js";
import createResourceStore from "../../../storage/resource-stores/index.js";
import { createSearchStore } from "../../../storage/search-stores/index.js";
import { DBTransaction } from "../../../storage/transactions.js";
import { OPERATIONS_QUEUE } from "../constants.js";

async function handleCreateMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.CreateOperation<queue.MutationType>,
) {
  if (mutation.resource === "resources") {
    return ctx.store.insert(
      ctx,
      (mutation as queue.CreateOperation<"resources">).value,
    );
  } else {
    const otherMutation: queue.CreateOperation<
      Exclude<queue.MutationType, "resources">
    > = mutation as queue.CreateOperation<
      Exclude<queue.MutationType, "resources">
    >;
    return db
      .insert(otherMutation.resource, [otherMutation.value])
      .run(ctx.store.getClient());
  }
}

async function handleUpdateMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.UpdateOperation<queue.MutationType>,
) {
  return db
    .upsert(mutation.resource, mutation.value, mutation.constraint, {
      updateColumns: mutation.onConflict,
    })
    .run(ctx.store.getClient());
}

async function handleDeleteMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.DeleteOperation<queue.MutationType>,
) {
  return db
    .deletes(mutation.resource, mutation.where)
    .run(ctx.store.getClient());
}

async function handleMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.Operations[number],
) {
  if (mutation.type === "invoke") {
    await ctx.client.request(asRoot(ctx), mutation.value);
  } else if (mutation.type === "create")
    await handleCreateMutation(ctx, mutation);
  else if (mutation.type === "update")
    await handleUpdateMutation(ctx, mutation);
  else if (mutation.type === "delete")
    await handleDeleteMutation(ctx, mutation);
}

export default async function createStorageWorker() {
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: process.env.QUEUE_BROKERS?.split(",") ?? [],
    clientId: process.env.QUEUE_CLIENT_ID,
  });

  const consumer = kafka.consumer({ groupId: "storage" });
  const iguhealthServices: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    queue: await createQueue(),
    store: await createResourceStore({ type: "postgres" }),
    search: await createSearchStore({ type: "postgres" }),
    logger: createLogger(),
    terminologyProvider: new TerminologyProvider(),
    emailProvider: createEmailProvider(),
    ...createClient(),
  };

  await consumer.connect();
  await consumer.subscribe({ topic: OPERATIONS_QUEUE, fromBeginning: true });
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        iguhealthServices.logger.info(
          `[STORAGE], Processing message ${message.key?.toString()}`,
        );
        const tenantId = message.headers?.tenant?.toString() as
          | TenantId
          | undefined;

        if (!tenantId) {
          throw new Error("Tenant ID not found in message headers");
        }

        if (message.value) {
          const mutations: queue.Operations = JSON.parse(
            message.value.toString(),
          );
          await DBTransaction(
            iguhealthServices,
            db.IsolationLevel.RepeatableRead,
            async () => {
              for (const mutation of mutations) {
                await handleMutation(
                  { ...iguhealthServices, tenant: tenantId },
                  mutation,
                );
              }
            },
          );
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
