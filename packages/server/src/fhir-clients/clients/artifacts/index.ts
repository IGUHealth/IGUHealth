import * as db from "zapatos/db";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClient } from "@iguhealth/client/interface";
import {
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { AllInteractions, RequestType } from "@iguhealth/client/types";
import { TenantId } from "@iguhealth/jwt";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { PostgresStore } from "../../../resource-stores/postgres/index.js";
import { PostgresSearchEngine } from "../../../search-stores/postgres/index.js";
import createRequestToResponseMiddleware from "../../middleware/request-to-response.js";
import {
  createInTransactionMiddleware,
  createSynchronousIndexingMiddleware,
  createSynchronousStorageMiddleware,
} from "../../middleware/synchronous-storage.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";

type ArtifactConfig = {
  operationsAllowed: RequestType[AllInteractions][];
  db: db.Queryable;
};

export const ARTIFACT_TENANT: TenantId = "iguhealth" as TenantId;

/**
 * Sets the tenant for the artifact client.
 * Because artifacts will be stored in a root tenant that's shared.
 * @returns
 */
function createSetArtifactTenantMiddleware<
  CTX extends IGUHealthServerCTX,
  State extends ArtifactConfig,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    return next({
      ...context,
      ctx: { ...context.ctx, tenant: ARTIFACT_TENANT },
    });
  };
}

function associateConfig<
  CTX extends IGUHealthServerCTX,
  State extends ArtifactConfig,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    return next({
      ...context,
      ctx: {
        ...context.ctx,
        search: new PostgresSearchEngine(context.state.db),
        store: new PostgresStore(context.state.db),
      },
    });
  };
}

/**
 * Create a client that's used for shared artifacts like CodeSystem, ValueSet, StructureDefinition, and SearchParameter.
 * @param artifactConfig The configuration for artifact client. Right now it's just the tenant id.
 * @returns The FHIR client for artifacts.
 */
export function createArtifactClient<CTX extends IGUHealthServerCTX>(
  config: ArtifactConfig,
): FHIRClient<CTX> {
  return new AsynchronousClient<ArtifactConfig, CTX>(
    config,
    createMiddlewareAsync(
      [
        associateConfig(),
        createSetArtifactTenantMiddleware(),
        validateOperationsAllowed(config.operationsAllowed),
        createRequestToResponseMiddleware(),
        createInTransactionMiddleware(),
        createSynchronousStorageMiddleware(),
        createSynchronousIndexingMiddleware(),
      ],
      {
        logging: false,
      },
    ),
  );
}
