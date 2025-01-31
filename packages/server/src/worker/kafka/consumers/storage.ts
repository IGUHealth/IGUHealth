import * as db from "zapatos/db";

import { TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import createEmailProvider from "../../../email/index.js";
import { toDBFHIRVersion } from "../../../fhir-clients/utilities/version.js";
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
import { DBTransaction } from "../../../transactions.js";
import createKafkaConsumer from "../local.js";
import { MessageHandler } from "../types.js";

async function handleMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.Operations[number],
) {
  switch (mutation.request.type) {
    case "create-request": {
      await ctx.store.insert(ctx, "resources", {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(mutation.request.fhirVersion),
        request_method: "POST",
        author_type: mutation.author.reference?.split("/")[0] as string,
        author_id: mutation.author.reference?.split("/")[1] as string,
        resource: mutation.response.resource as unknown as db.JSONObject,
      });
    }

    case "update-request": {
      ctx.store.insert(ctx, "resources", mutation.request.value);
    }

    case "patch-request": {
      ctx.store.insert(ctx, "resources", mutation.request.value);
    }

    case "delete-request": {
      ctx.store.insert(ctx, "resources", {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(mutation.request.fhirVersion),
        request_method: "DELETE",
        author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
        author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
        resource: mutation.response.resource as unknown as db.JSONObject,
        deleted: true,
      });
    }

    case "invoke-request": {
      await ctx.client.request(asRoot(ctx), mutation.request);
    }
    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Operation type '${mutation.request.type}' is not supported in this consumer.`,
        ),
      );
    }
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
    Consumers.Storage,
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
