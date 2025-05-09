import * as db from "zapatos/db";

import { FHIRResponse, toInteraction } from "@iguhealth/client/lib/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { toDBFHIRVersion } from "../../../../fhir-clients/utilities/version.js";
import { IGUHealthServerCTX, asRoot } from "../../../../fhir-server/types.js";
import { StorageTransaction } from "../../../../transactions.js";
import * as queue from "../../providers/interface.js";
import { MessageHandler } from "../types.js";
import { getTenantId } from "./utilities.js";

export function toMethod(
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
          // @ts-ignore
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
      await ctx.store.fhir.insert(asRoot(ctx), "resources", {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(mutation.response.fhirVersion),
        fhir_method: toInteraction<"create" | "update" | "patch">(
          mutation.response.type,
        ),
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
          await ctx.store.fhir.insert(asRoot(ctx), "resources", {
            tenant: ctx.tenant,
            fhir_version: toDBFHIRVersion(mutation.response.fhirVersion),
            fhir_method: toInteraction<"delete">(mutation.response.type),
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
              await ctx.store.fhir.insert(asRoot(ctx), "resources", {
                tenant: ctx.tenant,
                fhir_version: toDBFHIRVersion(mutation.response.fhirVersion),
                fhir_method: toInteraction<"delete">(mutation.response.type),
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

    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Operation type '${mutation.response.type}' is not supported in this consumer.`,
        ),
      );
    }
  }
}

const storageHandler: MessageHandler<
  Omit<IGUHealthServerCTX, "user" | "tenant">
> = async (iguhealthServices, { messages }) => {
  for (const message of messages) {
    iguhealthServices.logger.info(
      `[STORAGE], Processing message '${message.key?.toString() ?? "[no-key]"}'`,
    );
    const tenantId = getTenantId(message);

    if (message.value) {
      const mutations: queue.Operations = message.value as queue.Operations;
      await StorageTransaction(
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
  }
};

export default storageHandler;
