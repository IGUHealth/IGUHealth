import * as db from "zapatos/db";

import {
  InstanceDeleteResponse,
  SystemDeleteResponse,
  TypeDeleteResponse,
  toInteraction,
} from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { id } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX, asRoot } from "../../fhir-server/types.js";
import { toMethod } from "../../queue/consumers/handlers/storage.js";
import { PostgresSearchEngine } from "../../search-stores/postgres/index.js";
import { StorageTransaction } from "../../transactions.js";
import { toDBFHIRVersion } from "../utilities/version.js";

export function transactionMiddleware<
  State,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function transactionmiddleware(state, context, next) {
    switch (context.response?.type) {
      case "create-response":
      case "update-response":
      case "patch-response":
      case "delete-response":
        return StorageTransaction(
          context.ctx,
          db.IsolationLevel.RepeatableRead,
          async (txCTX) => {
            return next(state, {
              ...context,
              ctx: {
                ...txCTX,
                search: new PostgresSearchEngine(txCTX.store.getClient()),
              },
            });
          },
        );

      default: {
        // No need to do anything.
        return next(state, context);
      }
    }
  };
}

export function storageMiddleware<
  State,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function synchronousStorageMiddleware(state, context, next) {
    const res = await next(state, context);
    const responseType = res[1].response?.type;
    switch (responseType) {
      case "create-response":
      case "update-response":
      case "patch-response": {
        context.ctx.logger.info(
          `synchronous storing resource '${res[1].response.body.id}'`,
        );

        await res[1].ctx.store.fhir.insert(res[1].ctx, "resources", {
          tenant: res[1].ctx.tenant,
          fhir_version: toDBFHIRVersion(res[1].response.fhirVersion),
          fhir_method: toInteraction<"patch" | "update" | "create">(
            responseType,
          ),
          request_method: toMethod(res[1].response),
          author_type: res[1].ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
          author_id: res[1].ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
          resource: res[1].response.body as unknown as db.JSONObject,
          deleted: false,
        });
        break;
      }
      case "delete-response": {
        switch (context.request.level) {
          case "instance": {
            const response = res[1]
              .response as InstanceDeleteResponse<FHIR_VERSION>;
            if (!res[1].response?.deletion)
              throw new Error(
                "Deletion operation must return a deletion object.",
              );

            await res[1].ctx.store.fhir.insert(res[1].ctx, "resources", {
              tenant: res[1].ctx.tenant,
              fhir_version: toDBFHIRVersion(res[1].response.fhirVersion),
              fhir_method: toInteraction<"delete">(responseType),
              request_method: toMethod(response),
              author_type: res[1].ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
              author_id: res[1].ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
              resource: response.deletion as unknown as db.JSONObject,
              deleted: true,
            });
            break;
          }
          case "type":
          case "system": {
            const response = res[1].response as
              | TypeDeleteResponse<FHIR_VERSION>
              | SystemDeleteResponse<FHIR_VERSION>;
            await Promise.all(
              (response.deletion ?? []).map(async (resourceToDelete) => {
                await res[1].ctx.store.fhir.insert(res[1].ctx, "resources", {
                  tenant: res[1].ctx.tenant,
                  fhir_version: toDBFHIRVersion(response.fhirVersion),
                  fhir_method: toInteraction<"delete">(responseType),
                  request_method: toMethod(response),
                  author_type:
                    res[1].ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
                  author_id: res[1].ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
                  resource: resourceToDelete as unknown as db.JSONObject,
                  deleted: true,
                });
              }),
            );
            break;
          }
          default: {
            throw new OperationError(
              outcomeError("not-supported", `Invalid level.`),
            );
          }
        }
        break;
      }
      default: {
        // No need to do anything.
      }
    }
    return res;
  };
}

/**
 * Indexing middleware for searching. This happens within a single transaction if single postgres[1].
 * @returns
 */
export function indexingMiddleware<
  State,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function synchronousIndexingMiddleware(state, context, next) {
    const res = await next(state, context);
    switch (res[1].response?.type) {
      case "create-response":
      case "update-response":
      case "patch-response": {
        context.ctx.logger.info(
          `indexing resource '${res[1].response.body.id}'`,
        );
        try {
          await res[1].ctx.search.index(
            asRoot(res[1].ctx),
            res[1].response.fhirVersion,
            res[1].response.body,
          );
          context.ctx.logger.info(
            `finished indexing resource '${res[1].response.body.id}'`,
          );
        } catch (e) {
          context.ctx.logger.error({ message: "FAILURE:", e });
          throw e;
        }
        break;
      }
      case "delete-response": {
        switch (res[1].response.level) {
          case "instance": {
            await res[1].ctx.search.removeIndex(
              asRoot(res[1].ctx),
              res[1].response.fhirVersion,
              res[1].response.id,
              res[1].response.resource,
            );
            break;
          }
          case "type":
          case "system": {
            const response = res[1].response as
              | TypeDeleteResponse<FHIR_VERSION>
              | SystemDeleteResponse<FHIR_VERSION>;

            await Promise.all(
              (response.deletion ?? []).map(async (r) => {
                await res[1].ctx.search.removeIndex(
                  asRoot(res[1].ctx),
                  response.fhirVersion,
                  r.id as id,
                  r.resourceType,
                );
              }),
            );
            break;
          }
        }
      }
    }

    return res;
  };
}
