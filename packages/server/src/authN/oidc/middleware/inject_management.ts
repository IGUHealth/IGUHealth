import * as Koa from "koa";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { KoaExtensions } from "../../../fhir-api/types.js";
import TenantAuthorizationCodeManagement from "../../db/code/index.js";
import TenantUserManagement from "../../db/users/index.js";

/**
 * Inject Tenant management into the context.
 * @returns Koa.Middleware
 */
export function injectTenantManagement(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    if (!ctx.state.iguhealth.tenant) {
      throw new OperationError(outcomeFatal("invalid", "No Tenant"));
    }

    ctx.state.oidc = {
      ...ctx.state.oidc,
      userManagement: new TenantUserManagement(ctx.state.iguhealth.tenant),
      codeManagement: new TenantAuthorizationCodeManagement(
        ctx.state.iguhealth.tenant,
      ),
    };

    await next();
  };
}
