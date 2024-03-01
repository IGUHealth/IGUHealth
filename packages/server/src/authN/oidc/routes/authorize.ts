import type * as Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../../fhir-context/types.js";

type AuthorizationRequestBody = {
  response_type: "token";
  client_id: string;
  redirect_uri?: string;
  scope?: string;
  state?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

const AuthorizationBodyKeys = [
  "response_type",
  "client_id",
  "redirect_uri",
  "scope",
  "state",
];

/**
   * Validate unknown body to be conformant with authorization code request body
   * @param body 
   *  response_type
                  REQUIRED.  Value MUST be set to "token".
      client_id
                  REQUIRED.  The client identifier as described in Section 2.2.
      redirect_uri
                  OPTIONAL.  As described in Section 3.1.2.
      scope
                  OPTIONAL.  The scope of the access request as described by
                  Section 3.3.
      state
                  RECOMMENDED.  An opaque value used by the client to maintain
                  state between the request and callback.  The authorization
                  server includes this value when redirecting the user-agent back
                  to the client.  The parameter SHOULD be used for preventing
                  cross-site request forgery as described in Section 10.12.
  
   * @returns Boolean whether the body is valid for authorization code exchange.
   */
function validateAuthorizationCodeBody(
  body: Record<string, unknown>,
): body is AuthorizationRequestBody {
  // Required checks
  if (body.response_type !== "token") return false;
  if (typeof body.client_id !== "string") return false;

  // Optional checks
  if (body.redirect_uri && typeof body.redirect_uri !== "string") return false;
  if (body.scope && typeof body.scope !== "string") return false;
  if (body.state && typeof body.state !== "string") return false;

  // Verify only the select keys are allowed
  return Object.keys(body).every((k) => AuthorizationBodyKeys.includes(k));
}

/**
 * Implementation of authorization endpoint.
 * Used by the following grants: authorization_code, implicit, password.
 * client_credentials does not use this endpoint https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4.1.
 */
export function authorizationEndpoint<
  State,
  C extends Koa.DefaultContext,
>(): Koa.Middleware<State, KoaContext.FHIR<C>> {
  return async (ctx) => {
    const body = (ctx.request as unknown as Record<string, unknown>).body;
    if (!isRecord(body)) {
      throw new OperationError(
        outcomeError("invalid", "Body must be a record."),
      );
    }

    if (!validateAuthorizationCodeBody(body)) {
      throw new OperationError(
        outcomeError("invalid", "Invalid authorization request"),
      );
    }
    // const { response_type, client_id, redirect_uri, scope, state } = body;
    throw new Error("Not Implemented");
  };
}
