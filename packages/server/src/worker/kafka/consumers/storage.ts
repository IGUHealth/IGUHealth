import * as db from "zapatos/db";

import { CUSTOM_CLAIMS, TenantId } from "@iguhealth/jwt";
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
  switch (true) {
    case queue.isOperationType("create", mutation): {
      await ctx.store.insert(ctx, "resources", {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(mutation.request.fhirVersion),
        request_method: "POST",
        author_type: mutation.author[CUSTOM_CLAIMS.RESOURCE_TYPE],
        author_id: mutation.author[CUSTOM_CLAIMS.RESOURCE_ID],
        resource: mutation.response.body as unknown as db.JSONObject,
      });
      return;
    }

    case queue.isOperationType("update", mutation): {
      await ctx.store.insert(ctx, "resources", {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(mutation.request.fhirVersion),
        request_method: "PUT",
        author_type: mutation.author[CUSTOM_CLAIMS.RESOURCE_TYPE],
        author_id: mutation.author[CUSTOM_CLAIMS.RESOURCE_ID],
        resource: mutation.response.body as unknown as db.JSONObject,
      });
      return;
    }

    case queue.isOperationType("patch", mutation): {
      await ctx.store.insert(ctx, "resources", {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(mutation.request.fhirVersion),
        request_method: "PATCH",
        author_type: mutation.author[CUSTOM_CLAIMS.RESOURCE_TYPE],
        author_id: mutation.author[CUSTOM_CLAIMS.RESOURCE_ID],
        resource: mutation.response.body as unknown as db.JSONObject,
      });
      return;
    }

    case queue.isOperationType("delete", mutation): {
      if (!mutation.response.deletion) {
        throw new OperationError(
          outcomeError(
            "not-supported",
            "Deletion operation must return a deletion object.",
          ),
        );
      }
      switch (mutation.response.level) {
        case "instance": {
          await ctx.store.insert(ctx, "resources", {
            tenant: ctx.tenant,
            fhir_version: toDBFHIRVersion(mutation.request.fhirVersion),
            request_method: "DELETE",
            author_type: mutation.author[CUSTOM_CLAIMS.RESOURCE_TYPE],
            author_id: mutation.author[CUSTOM_CLAIMS.RESOURCE_ID],
            resource: mutation.response.deletion as unknown as db.JSONObject,
            deleted: true,
          });
          return;
        }
        case "type":
        case "system": {
          await Promise.all(
            (mutation.response.deletion ?? []).map(async (resourceToDelete) => {
              await ctx.store.insert(ctx, "resources", {
                tenant: ctx.tenant,
                fhir_version: toDBFHIRVersion(mutation.request.fhirVersion),
                request_method: "DELETE",
                author_type: mutation.author[CUSTOM_CLAIMS.RESOURCE_TYPE],
                author_id: mutation.author[CUSTOM_CLAIMS.RESOURCE_ID],
                resource: resourceToDelete as unknown as db.JSONObject,
                deleted: true,
              });
            }),
          );
          return;
        }
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Deletion level '${mutation.response.level}' is not supported.`,
            ),
          );
        }
      }
    }

    case queue.isOperationType("invoke", mutation): {
      await ctx.client.request(asRoot(ctx), mutation.request);
      return;
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
