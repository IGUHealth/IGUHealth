import * as db from "zapatos/db";

import {
  InstanceDeleteResponse,
  SystemDeleteResponse,
  TypeDeleteResponse,
} from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { id } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX, asRoot } from "../../fhir-server/types.js";
import { PostgresSearchEngine } from "../../search-stores/postgres/index.js";
import { DBTransaction } from "../../transactions.js";
import { toMethod } from "../../worker/kafka/consumers/storage.js";
import { toDBFHIRVersion } from "../utilities/version.js";

export function createInTransactionMiddleware<
  State,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function inTransactionMiddleware(context, next) {
    return DBTransaction(
      context.ctx,
      db.IsolationLevel.RepeatableRead,
      async (ctx) => {
        return next({
          ...context,
          ctx: {
            ...context.ctx,
            search: new PostgresSearchEngine(ctx.store.getClient()),
          },
        });
      },
    );
  };
}

export function createSynchronousStorageMiddleware<
  State,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function synchronousStorageMiddleware(context, next) {
    const res = await next(context);
    switch (res.response?.type) {
      case "create-response":
      case "update-response":
      case "patch-response": {
        await res.ctx.store.insert(res.ctx, "resources", {
          tenant: res.ctx.tenant,
          fhir_version: toDBFHIRVersion(res.response.fhirVersion),
          request_method: toMethod(res.response),
          author_type: res.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
          author_id: res.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
          resource: res.response.body as unknown as db.JSONObject,
          deleted: false,
        });
        break;
      }
      case "delete-response": {
        switch (context.request.level) {
          case "instance": {
            const response =
              res.response as InstanceDeleteResponse<FHIR_VERSION>;
            if (!res.response.deletion)
              throw new Error(
                "Deletion operation must return a deletion object.",
              );

            await res.ctx.store.insert(res.ctx, "resources", {
              tenant: res.ctx.tenant,
              fhir_version: toDBFHIRVersion(res.response.fhirVersion),
              request_method: toMethod(response),
              author_type: res.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
              author_id: res.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
              resource: response.deletion as unknown as db.JSONObject,
              deleted: true,
            });
            break;
          }
          case "type":
          case "system": {
            const response = res.response as
              | TypeDeleteResponse<FHIR_VERSION>
              | SystemDeleteResponse<FHIR_VERSION>;
            await Promise.all(
              (response.deletion ?? []).map(async (resourceToDelete) => {
                await res.ctx.store.insert(res.ctx, "resources", {
                  tenant: res.ctx.tenant,
                  fhir_version: toDBFHIRVersion(response.fhirVersion),
                  request_method: toMethod(response),
                  author_type:
                    res.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
                  author_id: res.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
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
      case "transaction-response": {
        throw new OperationError(
          outcomeError(
            "not-supported",
            `Transactions not supported for synchronous middleware.`,
          ),
        );
      }
      default: {
        // No need to do anything.
      }
    }
    return res;
  };
}

/**
 * Indexing middleware for searching. This happens within a single transaction if single postgres.
 * @returns
 */
export function createSynchronousIndexingMiddleware<
  State,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function synchronousIndexingMiddleware(context, next) {
    const res = await next(context);
    switch (res.response?.type) {
      case "create-response":
      case "update-response":
      case "patch-response": {
        await res.ctx.search.index(
          asRoot(res.ctx),
          res.response.fhirVersion,
          res.response.body,
        );
        break;
      }
      case "delete-response": {
        switch (res.response.level) {
          case "instance": {
            await res.ctx.search.removeIndex(
              asRoot(res.ctx),
              res.response.fhirVersion,
              res.response.id,
              res.response.resource,
            );
            break;
          }
          case "type":
          case "system": {
            const response = res.response as
              | TypeDeleteResponse<FHIR_VERSION>
              | SystemDeleteResponse<FHIR_VERSION>;

            await Promise.all(
              (response.deletion ?? []).map(async (r) => {
                await res.ctx.search.removeIndex(
                  asRoot(res.ctx),
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
