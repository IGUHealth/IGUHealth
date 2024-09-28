import { randomBytes } from "crypto";

import { id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asRoot } from "../../../../fhir-api/types.js";
import { OIDC_ROUTES } from "../../constants.js";
import { OIDCRouteHandler } from "../../index.js";

type InitiateInfo = {
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
  idpId: id,
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

  const info = {
    state,
    redirect_to: ctx.query["redirect_to"],
  };

  ctx.session[`initiate_${idpId}`] = JSON.stringify(info);

  return info;
}

export function federatedInitiate(): OIDCRouteHandler {
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

    const { state } = setSessionInfo(ctx, idpProvider.id as id);

    authorizationURL.searchParams.append("state", state);

    ctx.redirect(authorizationURL.href);
  };
}
