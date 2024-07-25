import * as Koa from "koa";

import { KoaExtensions } from "../../../fhir-api/types.js";
import { getClientCredentials } from "../client_credentials_verification.js";

/**
 * Inject Tenant management into the context.
 * @returns Koa.Middleware
 */
export function injectClientCredentialsMiddleware(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    const credentials = getClientCredentials(ctx.request);
    ctx.state.oidc = {
      ...ctx.state.oidc,
      parameters: {
        ...ctx.state.oidc.parameters,
        client_id: credentials?.client_id,
        client_secret: credentials?.client_secret,
      },
    };

    await next();
  };
}
