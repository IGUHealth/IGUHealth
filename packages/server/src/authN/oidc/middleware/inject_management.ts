import * as Koa from "koa";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../../fhir-api/types.js";
import GlobalAuthorizationCodeManagement from "../../db/code/provider/global.js";
import TenantAuthorizationCodeManagement from "../../db/code/provider/tenant.js";
import GlobalUserManagement from "../../db/users/provider/global.js";
import TenantUserManagement from "../../db/users/provider/tenant.js";

/**
 * Inject Global management into the context.
 * @returns Koa.Middleware
 */
export function injectGlobalManagement<State>(): Koa.Middleware<
  State,
  Koa.DefaultContext & KoaContext.OIDC
> {
  return async (ctx, next) => {
    ctx.oidc = {
      ...ctx.oidc,
      userManagement: new GlobalUserManagement(),
      codeManagement: new GlobalAuthorizationCodeManagement(),
    };

    await next();
  };
}

/**
 * Inject Tenant management into the context.
 * @returns Koa.Middleware
 */
export function injectTenantManagement<State, C>(): Koa.Middleware<
  State,
  KoaContext.FHIR<C>
> {
  return async (ctx, next) => {
    if (!ctx.FHIRContext.tenant) {
      throw new OperationError(outcomeFatal("invalid", "No Tenant"));
    }

    ctx.oidc = {
      ...ctx.oidc,
      userManagement: new TenantUserManagement(ctx.FHIRContext.tenant),
      codeManagement: new TenantAuthorizationCodeManagement(
        ctx.FHIRContext.tenant,
      ),
    };

    await next();
  };
}
