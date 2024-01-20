import Router from "@koa/router";
import type * as Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaFHIRContext } from "../../fhir/koa.js";
import { getSigningKey } from "../certifications.js";
import { createToken } from "../token.js";
import { getCredentialsBasicHeader } from "../utilities.js";
import { createClientInjectMiddleware } from "./middleware/client_find.js";

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
>(): Koa.Middleware<State, KoaFHIRContext<C>> {
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

/**
 * Returns an access token that can be used to access protected resources.
 */
export function tokenEndpoint<
  State,
  C extends Koa.DefaultContext,
>(): Koa.Middleware<State, KoaFHIRContext<C>> {
  return async (ctx) => {
    const body = (ctx.request as unknown as Record<string, unknown>).body;
    if (!isRecord(body)) {
      throw new OperationError(
        outcomeError("invalid", "Body must be a record."),
      );
    }

    if (!ctx.oidc.client) {
      throw new OperationError(
        outcomeError("invalid", "Could not find client in context."),
      );
    }

    switch (body.grant_type) {
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1
      case "authorization_code": {
        throw new Error("Not Implemented");
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-6
      case "refresh_token": {
        throw new Error("Not Implemented");
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4
      case "client_credentials": {
        const credentials = getCredentialsBasicHeader(ctx.request);

        if (ctx.oidc.client.grantType !== "client_credentials") {
          throw new OperationError(
            outcomeError(
              "invalid",
              "Grant type must be client_credentials for registered client.",
            ),
          );
        }

        if (!credentials) {
          throw new OperationError(
            outcomeError("invalid", "Could not find credentials in request."),
          );
        }

        if (credentials?.client_id !== ctx.oidc.client?.id) {
          throw new OperationError(
            outcomeError("security", "Invalid credentials for client."),
          );
        }

        if (credentials?.client_secret !== ctx.oidc.client.secret) {
          throw new OperationError(
            outcomeError("security", "Invalid credentials for client."),
          );
        }

        ctx.body = {
          access_token: await createToken(
            await getSigningKey(
              process.env.AUTH_CERTIFICATION_LOCATION as string,
              process.env.AUTH_SIGNING_KEY as string,
            ),
            {
              header: { audience: process.env.AUTH_JWT_AUDIENCE as string },
              payload: {
                "https://iguhealth.app/tenants": [
                  {
                    id: ctx.FHIRContext.tenant,
                    userRole: "User",
                  },
                ],
                "https://iguhealth.app/resourceType": "ClientApplication",
                sub: ctx.oidc.client.id,
                aud: ["https://iguhealth.com/api"],
                scope: "openid profile email offline_access",
              },
            },
          ),
          token_type: "Bearer",
          expires_in: 7200,
        };
        ctx.status = 200;
        ctx.set("Content-Type", "application/json");
        break;
      }
      default: {
        throw new OperationError(
          outcomeError("invalid", "Grant type not supported"),
        );
      }
    }
  };
}

/**
 * Creates a router for oidc endpoints.
 * @returns Router for oidc endpoints.
 */
export function createOIDCRouter<State, C>(): Router<State, KoaFHIRContext<C>> {
  const oidcRouter = new Router<State, KoaFHIRContext<C>>({ prefix: "/oidc" });
  oidcRouter.post("/token", createClientInjectMiddleware(), tokenEndpoint());

  return oidcRouter;
}
