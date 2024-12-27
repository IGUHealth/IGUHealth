import type * as Koa from "koa";
import * as s from "zapatos/schema";

import { ClientApplication, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { getSigningKey } from "@iguhealth/jwt/certifications";
import { createToken } from "@iguhealth/jwt/token";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  JWT,
  Subject,
} from "@iguhealth/jwt/types";

import { IGUHealthServerCTX, asRoot } from "../../fhir-api/types.js";
import { getIssuer } from "./constants.js";

export type ClientCredentials = { client_id: string; client_secret: string };

/**
 * Will search for clientID and clientSecret in basic auth header.
 * @param request Koa request to derive credentials from.
 * @returns client_id and client_secret if found, undefined otherwise.
 */
export function getBasicHeaderCredentials(
  request: Koa.Request,
): ClientCredentials | undefined {
  const authHeader = request.headers.authorization;
  if (!authHeader) return;

  const [type, credentials] = authHeader.split(" ");
  if (type !== "Basic") return;

  const decoded = Buffer.from(credentials, "base64").toString("utf-8");
  const [client_id, client_secret] = decoded.split(":");

  return { client_id, client_secret };
}

export function getClientCredentials(
  request: Koa.Request,
): ClientCredentials | undefined {
  // Check Basic Auth header first
  const basicHeaderCredentials = getBasicHeaderCredentials(request);
  if (basicHeaderCredentials) return basicHeaderCredentials;

  // Now check body per https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3
  if ((request.body as Record<string, unknown>)?.client_id) {
    return {
      client_id: (request.body as Record<string, string>)?.client_id,
      client_secret: (request.body as Record<string, string>)?.client_secret,
    };
  }
}

export function authenticateClientCredentials(
  clientApplication: ClientApplication,
  credentials: ClientCredentials,
) {
  return (
    clientApplication.id === credentials.client_id &&
    clientApplication.secret === credentials.client_secret
  );
}

export async function createClientCredentialToken(
  ctx: Omit<IGUHealthServerCTX, "user">,
  client: ClientApplication,
  expiresIn = "1h",
): Promise<JWT<AccessTokenPayload<s.user_role>>> {
  const signingKey = await getSigningKey(
    process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
    process.env.AUTH_LOCAL_SIGNING_KEY,
  );

  const policies = await ctx.client.search_type(
    await asRoot(ctx),
    R4,
    "AccessPolicyV2",
    [{ name: "link", value: [client.id as id] }],
  );

  const accessTokenPayload: AccessTokenPayload<s.user_role> = {
    iss: getIssuer(ctx.tenant),
    aud: client.id as string,
    [CUSTOM_CLAIMS.TENANT]: ctx.tenant,
    [CUSTOM_CLAIMS.ROLE]: "member",
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: "ClientApplication",
    [CUSTOM_CLAIMS.RESOURCE_ID]: client.id as id,
    [CUSTOM_CLAIMS.RESOURCE_VERSION_ID]: client.meta?.versionId as id,
    [CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS]: policies.resources
      .map((p) => p.meta?.versionId)
      .filter((v) => v !== undefined),
    scope: client.scope ?? "",
    sub: client.id as string as Subject,
  };

  const token = await createToken<AccessTokenPayload<s.user_role>>({
    signingKey,
    payload: accessTokenPayload,
    expiresIn,
  });

  return token;
}
