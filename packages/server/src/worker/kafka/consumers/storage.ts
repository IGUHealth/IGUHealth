import * as db from "zapatos/db";

import { TenantId } from "@iguhealth/jwt";

import createEmailProvider from "../../../email/index.js";
import { createClient, createLogger } from "../../../fhir-server/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../fhir-terminology/index.js";
import createQueue from "../../../queue/index.js";
import * as queue from "../../../queue/interface.js";
import {
  ConsumerGroupID,
  OperationsTopic,
  TENANT_TOPIC_PATTERN,
} from "../../../queue/topics/index.js";
import createResourceStore from "../../../storage/resource-stores/index.js";
import { createSearchStore } from "../../../storage/search-stores/index.js";
import { DBTransaction } from "../../../storage/transactions.js";
import { MessageHandler } from "../types.js";
import createKafkaConsumer from "../local.js";

async function handleCreateMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.CreateOperation<queue.MutationType>,
) {
  return ctx.store.insert(ctx, mutation.resource, mutation.value);
}

async function handleUpdateMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.UpdateOperation<queue.MutationType>,
) {
  const sql = db.upsert(
    mutation.resource,
    mutation.value,
    mutation.constraint,
    {
      updateColumns: mutation.onConflict,
    },
  );

  return sql.run(ctx.store.getClient());
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
  } else if (mutation.type === "create") {
    await handleCreateMutation(ctx, mutation);
  } else if (mutation.type === "update") {
    await handleUpdateMutation(ctx, mutation);
  } else if (mutation.type === "delete") {
    await handleDeleteMutation(ctx, mutation);
  }
}

const handler: MessageHandler<
  Omit<IGUHealthServerCTX, "user" | "tenant">
> = async (iguhealthServices, { message }) => {
  iguhealthServices.logger.info(
    `[STORAGE], Processing message ${message.key?.toString()}`,
  );
  const tenantId = message.headers?.tenant?.toString() as TenantId | undefined;

  if (!tenantId) {
    throw new Error("Tenant ID not found in message headers");
  }

  if (message.value) {
    const mutations: queue.Operations = JSON.parse(message.value.toString());
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
};

export default async function createStorageWorker() {
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

  const stop = await createKafkaConsumer(
    iguhealthServices,
    TENANT_TOPIC_PATTERN(OperationsTopic),
    "storage" as ConsumerGroupID,
    async (ctx, { topic, partition, message }) => {
      try {
        await handler(ctx, { topic, partition, message });
      } catch (e) {
        console.error(e);
      }
    },
  );

  return stop;
}
