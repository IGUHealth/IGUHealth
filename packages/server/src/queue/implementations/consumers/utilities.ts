import * as s from "zapatos/schema";

import createHTTPClient from "@iguhealth/client/lib/http";
import { id } from "@iguhealth/fhir-types/r4/types";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  Subject,
  TenantId,
  createToken,
  getSigningKey,
} from "@iguhealth/jwt";

import { getIssuer } from "../../../authN/oidc/constants.js";
import { WORKER_APP } from "../../../authN/oidc/hardcodedClients/worker-app.js";
import { getCertConfig } from "../../../certification.js";
import { ConfigProvider } from "../../../config/provider/interface.js";
import { IGUHealthServerCTX } from "../../../fhir-server/types.js";

export type IGUHealthWorkerCTX = Pick<
  IGUHealthServerCTX,
  | "tenant"
  | "store"
  | "logger"
  | "lock"
  | "cache"
  | "user"
  | "resolveCanonical"
  | "config"
> & { workerID: string; client: ReturnType<typeof createHTTPClient> };

export async function workerTokenClaims(
  config: ConfigProvider,
  workerID: string,
  tenant: TenantId,
): Promise<AccessTokenPayload<s.user_role>> {
  const accessTokenPayload = {
    iss: await getIssuer(config, tenant),
    scope: "system/*.*",
    aud: WORKER_APP.id as id,
    sub: WORKER_APP.id as string as Subject,
    [CUSTOM_CLAIMS.RESOURCE_ID]: WORKER_APP.id as id,
    [CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS]: [],
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: WORKER_APP.resourceType,
    [CUSTOM_CLAIMS.TENANT]: tenant,
    [CUSTOM_CLAIMS.ROLE]: "admin",
  } as AccessTokenPayload<s.user_role>;

  return accessTokenPayload;
}

export type WorkerClient = Awaited<
  ReturnType<typeof createWorkerIGUHealthClient>
>;
export type WorkerClientCTX = Parameters<WorkerClient["request"]>[0];

async function createWorkerIGUHealthClient(
  services: Omit<IGUHealthWorkerCTX, "user" | "tenant" | "client">,
  tenant: TenantId,
  tokenPayload: AccessTokenPayload<s.user_role>,
): Promise<ReturnType<typeof createHTTPClient>> {
  if (tokenPayload[CUSTOM_CLAIMS.TENANT] !== tenant) {
    throw new Error("Token does not match tenant");
  }

  const client = createHTTPClient({
    url: new URL(`w/${tenant}`, await services.config.get("API_URL")).href,
    getAccessToken: async () => {
      const token = await createToken({
        signingKey: await getSigningKey(await getCertConfig(services.config)),
        payload: tokenPayload,
      });
      return token;
    },
  });

  return client;
}

export async function tenantWorkerContext(
  services: Omit<IGUHealthWorkerCTX, "user" | "tenant" | "client">,
  tenant: TenantId,
  claims: AccessTokenPayload<s.user_role>,
): Promise<IGUHealthWorkerCTX> {
  return {
    ...services,
    tenant: tenant,
    client: await createWorkerIGUHealthClient(services, tenant, claims),
    user: {
      resource: WORKER_APP,
      payload: claims,
    },
  };
}
