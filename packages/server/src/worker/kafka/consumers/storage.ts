import { Kafka, Partitioners, logLevel } from "kafkajs";
import * as db from "zapatos/db";

import { TenantId } from "@iguhealth/jwt";

import * as queue from "../../../queue/interface.js";
import { DBTransaction } from "../../../storage/transactions.js";
import { IGUHealthWorkerCTX, staticWorkerServices } from "../../utilities.js";
import { MUTATIONS_QUEUE } from "../constants.js";

async function handleCreateMutation(
  ctx: Omit<IGUHealthWorkerCTX, "user" | "tenant" | "client">,
  mutation: queue.CreateMutation<queue.IType>,
) {
  if (mutation.type === "resources") {
    return ctx.store.insert(
      {
        ...ctx,
        tenant: (mutation as queue.CreateMutation<"resources">).value
          .tenant as TenantId,
      },
      (mutation as queue.CreateMutation<"resources">).value,
    );
  } else {
    const otherMutation: queue.CreateMutation<
      Exclude<queue.IType, "resources">
    > = mutation as queue.CreateMutation<Exclude<queue.IType, "resources">>;
    return db
      .insert(otherMutation.type, [otherMutation.value])
      .run(ctx.store.getClient());
  }
}

async function handleUpdateMutation(
  ctx: Omit<IGUHealthWorkerCTX, "user" | "tenant" | "client">,
  mutation: queue.UpdateMutation<queue.IType>,
) {
  return db
    .upsert(mutation.type, mutation.value, mutation.constraint, {
      updateColumns: mutation.onConflict,
    })
    .run(ctx.store.getClient());
}

async function handleDeleteMutation(
  ctx: Omit<IGUHealthWorkerCTX, "user" | "tenant" | "client">,
  mutation: queue.DeleteMutation<queue.IType>,
) {
  return db.deletes(mutation.type, mutation.where).run(ctx.store.getClient());
}

async function handleMutation(
  ctx: Omit<IGUHealthWorkerCTX, "user" | "tenant" | "client">,
  mutation: queue.Mutations[number],
) {
  if (mutation.interaction === "create")
    await handleCreateMutation(ctx, mutation);
  else if (mutation.interaction === "update")
    await handleUpdateMutation(ctx, mutation);
  else if (mutation.interaction === "delete")
    await handleDeleteMutation(ctx, mutation);
}

export default async function createStorageWorker() {
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: process.env.QUEUE_BROKERS?.split(",") ?? [],
    clientId: process.env.QUEUE_CLIENT_ID,
  });

  const workerId = "kafka-worker-storage";
  const producer = kafka.producer({
    allowAutoTopicCreation: false,
    createPartitioner: Partitioners.DefaultPartitioner,
  });

  await producer.connect();
  const consumer = kafka.consumer({ groupId: "storage" });
  const services = await staticWorkerServices(workerId);

  await consumer.connect();
  await consumer.subscribe({ topic: MUTATIONS_QUEUE, fromBeginning: true });
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        services.logger.info(
          `[STORAGE], Processing message ${message.key?.toString()}`,
        );

        if (message.value) {
          const mutations: queue.Mutations = JSON.parse(
            message.value.toString(),
          );
          await DBTransaction(
            services,
            db.IsolationLevel.RepeatableRead,
            async () => {
              for (const mutation of mutations) {
                await handleMutation(services, mutation);
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
