import Koa from "koa";
import * as s from "zapatos/schema";

import { AccessTokenPayload, CUSTOM_CLAIMS, TenantClaim } from "@iguhealth/jwt";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../fhir-context/types.js";

function findCurrentTenant<Context extends Koa.DefaultContext>(
  ctx: KoaContext.FHIR<Context>,
): TenantClaim<s.user_role> | undefined {
  return ctx.state.user[CUSTOM_CLAIMS.TENANTS]?.find(
    (t: TenantClaim<s.user_role>) => t.id === ctx.FHIRContext.tenant,
  );
}

export async function verifyAndAssociateUserFHIRContext<
  State extends Koa.DefaultState,
  Context extends KoaContext.FHIR<Koa.DefaultContext>,
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
      jwt: ctx.state.user as AccessTokenPayload<s.user_role>,
      accessToken: ctx.state.access_token,
    },
  };
  await next();
}
