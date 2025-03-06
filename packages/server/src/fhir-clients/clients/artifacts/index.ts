import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClient } from "@iguhealth/client/lib/interface";
import {
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { TenantId } from "@iguhealth/jwt";

import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";
import { createRequestToResponse } from "../request-to-response/index.js";

type ArtifactConfig = {
  artifactTenant: TenantId;
  fhirDB: ReturnType<typeof createRequestToResponse>;
};

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
      ctx: { ...context.ctx, tenant: context.state.artifactTenant },
    });
  };
}

/**
 * Create a client that's used for shared artifacts like CodeSystem, ValueSet, StructureDefinition, and SearchParameter.
 * @param artifactConfig The configuration for artifact client. Right now it's just the tenant id.
 * @returns The FHIR client for artifacts.
 */
export function createArtifactClient<CTX extends IGUHealthServerCTX>(
  artifactConfig: ArtifactConfig,
): FHIRClient<CTX> {
  return new AsynchronousClient<ArtifactConfig, CTX>(
    artifactConfig,
    createMiddlewareAsync(
      [
        createSetArtifactTenantMiddleware(),
        validateOperationsAllowed([
          "read-request",
          "search-request",
          "vread-request",
          "history-request",
        ]),
        async (context) => {
          const response = await context.state.fhirDB.request(
            asRoot(context.ctx),
            context.request,
          );

          return {
            ...context,
            response,
          };
        },
      ],
      {
        logging: false,
      },
    ),
  );
}
