import Koa from "koa";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import type { FHIRServerCTX, JWT, TenantClaim } from "../../fhir/context.js";

function findCurrentTenant<
  Context extends Koa.DefaultContext & { FHIRContext: FHIRServerCTX },
>(ctx: Context): TenantClaim | undefined {
  return ctx.state.user["https://iguhealth.app/tenants"]?.find(
    (t: TenantClaim) => t.id === ctx.FHIRContext.tenant,
  );
}

export async function canUserAccessTenantMiddleware<
  State extends Koa.DefaultState,
  Context extends Koa.DefaultContext & { FHIRContext: FHIRServerCTX },
>(ctx: Koa.ParameterizedContext<State, Context>, next: Koa.Next) {
  if (!ctx.FHIRContext.tenant) {
    ctx.throw(400, "tenant is required");
  }

  const tenantClaim = findCurrentTenant(ctx);

  if (tenantClaim === undefined) {
    ctx.throw(
      403,
      `User is not authorized to access tenant ${ctx.params.tenant}`,
    );
  }

  if (
    typeof ctx.state.user.sub !== "string" ||
    typeof ctx.state.user.iss !== "string"
  )
    throw new OperationError(
      outcomeFatal("security", "JWT must have both sub and iss."),
    );

  ctx.FHIRContext = {
    ...ctx.FHIRContext,
    user: {
      role: tenantClaim.userRole,
      jwt: ctx.state.user as JWT,
      accessToken: ctx.state.access_token,
    },
  };
  return next();
}
