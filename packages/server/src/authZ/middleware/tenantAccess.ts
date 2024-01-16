import Koa from "koa";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import type { FHIRServerCTX, JWT, TenantClaim } from "../../fhir/context.js";

export function findCurrentTenant(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
): TenantClaim | undefined {
  return ctx.state.user["https://iguhealth.app/tenants"]?.find(
    (t: TenantClaim) => t.id === ctx.params.tenant,
  );
}

export async function canUserAccessTenantMiddleware<
  State extends Koa.DefaultState,
  Context extends Koa.DefaultContext & { FHIRContext: FHIRServerCTX },
>(ctx: Koa.ParameterizedContext<State, Context>, next: Koa.Next) {
  if (!ctx.params.tenant) {
    ctx.throw(400, "tenant is required");
  }
  if (findCurrentTenant(ctx) === undefined) {
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

  const tenant = findCurrentTenant(ctx);
  if (!tenant) throw new Error("Error tenant does not exist in context!");
  ctx.FHIRContext = {
    ...ctx.FHIRContext,
    tenant: tenant.id,
    user: {
      role: tenant.userRole,
      jwt: ctx.state.user as JWT,
      accessToken: ctx.state.access_token,
    },
  };
  return next();
}
