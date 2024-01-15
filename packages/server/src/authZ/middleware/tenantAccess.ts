import Koa from "koa";

import type { Tenant } from "../../fhir/context.js";

export function findCurrentTenant(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
): Tenant | undefined {
  return ctx.state.user["https://iguhealth.app/tenants"]?.find(
    (t: Tenant) => t.id === ctx.params.tenant,
  );
}

export async function canUserAccessTenantMiddleware(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next,
) {
  if (!ctx.params.tenant) {
    ctx.throw(400, "tenant is required");
  }
  if (findCurrentTenant(ctx) === undefined) {
    ctx.throw(
      403,
      `User is not authorized to access tenant ${ctx.params.tenant}`,
    );
  }
  return next();
}
