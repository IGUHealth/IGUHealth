import Koa from "koa";

import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import type { JWT, TenantClaim } from "../../fhir/context.js";
import { KoaFHIRContext } from "../../fhir/koa.js";

function findCurrentTenant<Context extends Koa.DefaultContext>(
  ctx: KoaFHIRContext<Context>,
): TenantClaim | undefined {
  return ctx.state.user["https://iguhealth.app/tenants"]?.find(
    (t: TenantClaim) => t.id === ctx.FHIRContext.tenant,
  );
}

export async function verifyAndAssociateUserFHIRContext<
  State extends Koa.DefaultState,
  Context extends KoaFHIRContext<Koa.DefaultContext>,
>(ctx: Koa.ParameterizedContext<State, Context>, next: Koa.Next) {
  if (!ctx.FHIRContext.tenant) {
    throw new OperationError(outcomeError("invalid", "No tenant present."));
  }

  const tenantClaim = findCurrentTenant(ctx);
  if (tenantClaim === undefined) {
    throw new OperationError(
      outcomeError(
        "security",
        `User is not authorized to access tenant ${ctx.params.tenant}`,
      ),
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
  await next();
}
