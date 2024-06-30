import * as Koa from "koa";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../../fhir-api/types.js";
import TenantAuthorizationCodeManagement from "../../db/code/index.js";
import TenantUserManagement from "../../db/users/index.js";

/**
 * Inject Tenant management into the context.
 * @returns Koa.Middleware
 */
export function injectTenantManagement<State, C>(): Koa.Middleware<
  State,
  KoaContext.IGUHealth<C>
> {
  return async (ctx, next) => {
    if (!ctx.iguhealth.tenant) {
      throw new OperationError(outcomeFatal("invalid", "No Tenant"));
    }

    ctx.oidc = {
      ...ctx.oidc,
      userManagement: new TenantUserManagement(ctx.iguhealth.tenant),
      codeManagement: new TenantAuthorizationCodeManagement(
        ctx.iguhealth.tenant,
      ),
    };

    await next();
  };
}
