import { AsynchronousClient } from "@iguhealth/client";
import {
  MiddlewareAsync,
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { TenantId } from "@iguhealth/jwt";

import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import { createRemoteStorage } from "../remote-storage/index.js";

type ArtifactState = {
  fhirDB: ReturnType<typeof createRemoteStorage>;
  artifactTenant: TenantId;
};

function moveToArtifactTenant<
  State extends ArtifactState,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    const ctx = asRoot({
      ...context.ctx,
      tenant: context.state.artifactTenant,
    }) as CTX;

    return next({
      ...context,
      ctx,
    });
  };
}

function createArtifactMiddleware<
  State extends ArtifactState,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync([
    moveToArtifactTenant(),
    async (context) => {
      return {
        ...context,
        response: await context.state.fhirDB.request(
          context.ctx,
          context.request,
        ),
      };
    },
  ]);
}

export default function createArtifactDatabase(state: ArtifactState) {
  return new AsynchronousClient(state, createArtifactMiddleware());
}
