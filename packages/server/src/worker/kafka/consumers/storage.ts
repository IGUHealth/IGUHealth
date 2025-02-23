import * as db from "zapatos/db";

import { FHIRResponse } from "@iguhealth/client/lib/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import createEmailProvider from "../../../email/index.js";
import { toDBFHIRVersion } from "../../../fhir-clients/utilities/version.js";
import { createClient, createLogger } from "../../../fhir-server/index.js";
import resolveCanonical from "../../../fhir-server/resolvers/resolveCanonical.js";
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
import { getTenantId } from "../utilities.js";

function toMethod(
  response: FHIRResponse<FHIR_VERSION, queue.MutationTypes>,
): "POST" | "PUT" | "DELETE" | "PATCH" {
  switch (response.type) {
    case "create-response":
      return "POST";
    case "patch-response":
      return "PATCH";
    case "update-response":
      return "PUT";
    case "delete-response":
      return "DELETE";
    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Operation type '${response.type}' is not supported in this consumer.`,
        ),
      );
    }
  }
}

async function handleMutation(
  ctx: Omit<IGUHealthServerCTX, "user">,
  mutation: queue.Operations[number],
) {
  switch (true) {
    case queue.isOperationType("create", mutation):
    case queue.isOperationType("update", mutation):
    case queue.isOperationType("patch", mutation): {
      await ctx.store.insert(ctx, "resources", {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(mutation.response.fhirVersion),
        request_method: toMethod(mutation.response),
        author_type: mutation.author[CUSTOM_CLAIMS.RESOURCE_TYPE],
        author_id: mutation.author[CUSTOM_CLAIMS.RESOURCE_ID],
        resource: mutation.response.body as unknown as db.JSONObject,
        deleted: false,
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
            fhir_version: toDBFHIRVersion(mutation.response.fhirVersion),
            request_method: toMethod(mutation.response),
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
                fhir_version: toDBFHIRVersion(mutation.response.fhirVersion),
                request_method: toMethod(mutation.response),
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
              // @ts-ignore
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
    `[STORAGE], Processing message '${message.key?.toString() ?? "[no-key]"}'`,
  );
  const tenantId = getTenantId(message);

  if (message.value) {
    const mutations: queue.Operations = JSON.parse(
      message.value.toString("utf-8"),
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
    client: createClient(),
    resolveCanonical,
  };

  const stop = await createKafkaConsumer(
    iguhealthServices,
    TENANT_TOPIC_PATTERN(OperationsTopic),
    Consumers.Storage,
    {
      eachMessage: async (ctx, { topic, partition, message }) => {
        await handler(ctx, { topic, partition, message });
      },
    },
  );

  return stop;
}
