import type * as Koa from "koa";
import * as s from "zapatos/schema";

import { ClientApplication, id } from "@iguhealth/fhir-types/r4/types";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  JWT,
  Subject,
  TENANT_ISSUER,
  TenantId,
  createToken,
} from "@iguhealth/jwt";

import {
  getCertKey,
  getCertLocation,
  getSigningKey,
} from "../certifications.js";

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
  tenant: TenantId,
  client: ClientApplication,
): Promise<JWT<AccessTokenPayload<s.user_role>>> {
  const signingKey = await getSigningKey(getCertLocation(), getCertKey());

  const accessTokenPayload: AccessTokenPayload<s.user_role> = {
    iss: TENANT_ISSUER(process.env.API_URL, tenant),
    aud: client.id as string,
    [CUSTOM_CLAIMS.TENANT]: tenant,
    [CUSTOM_CLAIMS.ROLE]: "member",
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: "ClientApplication",
    [CUSTOM_CLAIMS.RESOURCE_ID]: client.id as id,
    sub: client.id as string as Subject,
  };

  const token = await createToken<AccessTokenPayload<s.user_role>>({
    signingKey,
    payload: accessTokenPayload,
  });

  return token;
}

/**
 * Will search for clientID in request body and basic auth header and query parameter.
 * @param request Koa Request to derive client ID from.
 * @returns clientID if found, undefined otherwise.
 */
export function getClientId(request: Koa.Request): string | undefined {
  if ((request.body as Record<string, unknown>)?.client_id) {
    return (request.body as Record<string, string>)?.client_id;
  } else if (getBasicHeaderCredentials(request)?.client_id) {
    return getBasicHeaderCredentials(request)?.client_id;
  } else if (typeof request.query.client_id === "string") {
    return request.query.client_id;
  }
  return undefined;
}
