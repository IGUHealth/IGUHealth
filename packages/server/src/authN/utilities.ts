import type * as Koa from "koa";

/**
 * Will search for clientID and clientSecret in basic auth header.
 * @param request Koa request to derive credentials from.
 * @returns client_id and client_secret if found, undefined otherwise.
 */
export function getCredentialsBasicHeader(
  request: Koa.Request,
): { client_id: string; client_secret: string } | undefined {
  const authHeader = request.headers.authorization;
  if (!authHeader) return;

  const [type, credentials] = authHeader.split(" ");
  if (type !== "Basic") return;

  const decoded = Buffer.from(credentials, "base64").toString("utf-8");
  const [client_id, client_secret] = decoded.split(":");

  return { client_id, client_secret };
}

/**
 * Will search for clientID in request body and basic auth header and query parameter.
 * @param request Koa Request to derive client ID from.
 * @returns clientID if found, undefined otherwise.
 */
export function getClientId(request: Koa.Request): string | undefined {
  if ((request.body as Record<string, unknown>)?.client_id) {
    return (request.body as Record<string, string>)?.client_id;
  } else if (getCredentialsBasicHeader(request)?.client_id) {
    return getCredentialsBasicHeader(request)?.client_id;
  } else if (typeof request.query.client_id === "string") {
    return request.query.client_id;
  }
  return undefined;
}
