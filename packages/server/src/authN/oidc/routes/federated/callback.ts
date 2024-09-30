import * as jose from "jose";

import { code, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asRoot } from "../../../../fhir-api/types.js";
import * as users from "../../../db/users/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import { OIDCRouteHandler } from "../../index.js";
import { sessionSetUserLogin } from "../../session/user.js";
import { getSessionInfo } from "./initiate.js";

function deriveID(idpId: id, sub: string) {
  // "+" "/" and "=" symbols must be replaced.
  // 1234567890abcdefghijklmnopqrstuvwxyz is default character set for nanoid.
  return btoa(`${idpId}-${sub}`)
    .replaceAll("=", "_")
    .replaceAll("/", "_")
    .replaceAll("+", "_")
    .toLowerCase();
}

export function federatedCallback(): OIDCRouteHandler {
  return async (ctx) => {
    const idpId = ctx.params["identityProvider"];
    const idpProvider = await ctx.state.iguhealth.client.read(
      await asRoot(ctx.state.iguhealth),
      R4,
      "IdentityProvider",
      idpId as id,
    );

    if (!idpProvider) {
      throw new OperationError(
        outcomeError("exception", "Identity Provider not found"),
      );
    }

    const initialState = getSessionInfo(ctx, idpProvider.id as id);
    const code = ctx.query["code"];
    const state = ctx.query["state"];

    if (state !== initialState?.state) {
      throw new OperationError(outcomeError("exception", "Invalid state"));
    }

    if (!idpProvider.oidc?.token_endpoint) {
      throw new OperationError(
        outcomeError("exception", "Token endpoint not found"),
      );
    }
    if (typeof code !== "string") {
      throw new OperationError(outcomeError("exception", "Code not found"));
    }
    try {
      const tokenBody: Record<string, string> = {
        grant_type: "authorization_code",
        code,
        client_id: idpProvider.oidc?.client.clientId,
        redirect_uri: new URL(
          ctx.router.url(OIDC_ROUTES.FEDERATED_CALLBACK, {
            tenant: ctx.state.iguhealth.tenant,
            identityProvider: idpProvider.id,
          }) as string,
          process.env.API_URL,
        ).href,
      };

      if (idpProvider.oidc?.client.secret) {
        tokenBody.client_secret = idpProvider.oidc?.client.secret;
      }
      if (initialState?.code_verifier) {
        tokenBody.code_verifier = initialState.code_verifier;
      }

      const res = await fetch(idpProvider.oidc?.token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(tokenBody),
      });
      const payload = await res.json();
      const idToken = payload.id_token;

      if (!idToken) {
        throw new OperationError(
          outcomeError(
            "exception",
            "Failed to exchange code for token with IdP",
          ),
        );
      }

      // If JWKS than verify the signature of the idToken.
      if (idpProvider.oidc?.jwks_uri) {
        const { payload } = await jose.jwtVerify(
          idToken,
          jose.createRemoteJWKSet(new URL(idpProvider.oidc?.jwks_uri)),
        );

        const id = deriveID(idpProvider.id as id, payload.sub as string);

        const membership = await ctx.state.iguhealth.client.update(
          await asRoot(ctx.state.iguhealth),
          R4,
          "Membership",
          id as id,
          {
            id: id as id,
            resourceType: "Membership",
            email: payload.email as string,
            role: "member" as code,
            federated: {
              reference: "IdentityProvider/" + idpProvider.id,
            },
          },
        );

        const user = await users.search(
          ctx.state.iguhealth.db,
          ctx.state.iguhealth.tenant,
          {
            fhir_user_id: membership.id,
          },
        );

        if (user[0] !== undefined) {
          sessionSetUserLogin(ctx, user[0]);
          if (initialState?.redirect_to) {
            ctx.redirect(initialState.redirect_to);
          }
        } else {
          throw new OperationError(
            outcomeError("not-found", "Failed to federate the user."),
          );
        }
      }
    } catch (e) {
      if (e instanceof OperationError) {
        throw e;
      } else {
        ctx.state.iguhealth.logger.error(e);
        throw new OperationError(
          outcomeError(
            "exception",
            "Failed to exchange code for token with IdP",
          ),
        );
      }
    }
  };
}
