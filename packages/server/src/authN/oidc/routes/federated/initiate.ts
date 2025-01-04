import { randomBytes } from "crypto";

import { IdentityProvider, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asRoot } from "../../../../fhir-api/types.js";
import { OIDC_ROUTES } from "../../constants.js";
import { OIDCRouteHandler } from "../../index.js";
import { convertChallenge } from "../token.js";

type InitiateInfo = {
  code_verifier?: string;
  state: string;
  redirect_to: string;
};

export function getSessionInfo(
  ctx: Parameters<OIDCRouteHandler>[0],
  idpId: id,
): InitiateInfo | undefined {
  if (!ctx.session) {
    throw new OperationError(outcomeError("exception", "Session not found"));
  }
  const data = ctx.session[`initiate_${idpId}`];
  try {
    return JSON.parse(data) as InitiateInfo;
  } catch {
    ctx.session[`initiate_${idpId}`] = undefined;
    return undefined;
  }
}

function setSessionInfo(
  ctx: Parameters<OIDCRouteHandler>[0],
  idpProvider: IdentityProvider,
): InitiateInfo {
  const state = randomBytes(12).toString("hex");

  if (!ctx.session) {
    throw new OperationError(outcomeError("exception", "Session not found"));
  }
  if (typeof ctx.query["redirect_to"] !== "string") {
    throw new OperationError(
      outcomeError("exception", "redirect_to not found"),
    );
  }

  const info: InitiateInfo = {
    state,
    redirect_to: ctx.query["redirect_to"],
  };

  if (idpProvider.oidc?.pkce?.enabled) {
    const code_verifier = randomBytes(16).toString("hex");
    info.code_verifier = code_verifier;
  }

  ctx.session[`initiate_${idpProvider.id}`] = JSON.stringify(info);

  return info;
}

export function federatedInitiate(): OIDCRouteHandler {
  return async (ctx) => {
    const idpId = ctx.params["identityProvider"];
    const idpProvider = await ctx.state.iguhealth.client.read(
      asRoot(ctx.state.iguhealth),
      R4,
      "IdentityProvider",
      idpId as id,
    );

    if (!idpProvider) {
      throw new OperationError(
        outcomeError("exception", "Identity Provider not found"),
      );
    }

    const authorizationURL = new URL(
      idpProvider.oidc?.authorization_endpoint ?? "",
    );
    authorizationURL.searchParams.append("response_type", "code");
    authorizationURL.searchParams.append(
      "client_id",
      idpProvider.oidc?.client.clientId ?? "",
    );
    authorizationURL.searchParams.append(
      "redirect_uri",
      new URL(
        ctx.router.url(OIDC_ROUTES.FEDERATED_CALLBACK, {
          tenant: ctx.state.iguhealth.tenant,
          identityProvider: idpProvider.id,
        }) as string,
        process.env.API_URL,
      ).href,
    );

    authorizationURL.searchParams.append(
      "scope",
      idpProvider.oidc?.scopes?.join(" ") ?? "",
    );

    const { state, code_verifier } = setSessionInfo(ctx, idpProvider);

    authorizationURL.searchParams.append("state", state);

    if (idpProvider.oidc?.pkce?.enabled && code_verifier) {
      if (!idpProvider.oidc?.pkce?.code_challenge_method) {
        throw new OperationError(
          outcomeError("exception", "Code challenge method not found"),
        );
      }
      const code_challenge = convertChallenge(
        idpProvider.oidc?.pkce?.code_challenge_method as "S256" | "plain",
        code_verifier,
      );

      authorizationURL.searchParams.append("code_challenge", code_challenge);
      authorizationURL.searchParams.append(
        "code_challenge_method",
        idpProvider.oidc?.pkce?.code_challenge_method,
      );
    }

    ctx.redirect(authorizationURL.href);
  };
}
