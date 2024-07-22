import Koa from "koa";

import { CUSTOM_CLAIMS, TENANT_ISSUER } from "@iguhealth/jwt";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { KoaExtensions } from "../../fhir-api/types.js";

/**
 * Verify a users access to a given tenant based around JWT Claims
 * (see findCurrentTenant above for how search is done).
 *
 * @param ctx Parameterized Context with FHIR Services
 * @param next Koa Next function.
 */
export async function verifyAndAssociateUserFHIRContext<
  State extends KoaExtensions.IGUHealth,
  Context extends KoaExtensions.KoaIGUHealthContext,
>(ctx: Koa.ParameterizedContext<State, Context>, next: Koa.Next) {
  if (!ctx.state.iguhealth.tenant) {
    throw new OperationError(outcomeError("invalid", "No tenant present."));
  }

  if (
    ctx.state.iguhealth.user?.payload[CUSTOM_CLAIMS.TENANT] !==
    ctx.state.iguhealth.tenant
  ) {
    throw new OperationError(
      outcomeError(
        "security",
        `User is not authorized to access tenant ${ctx.params.tenant}`,
      ),
    );
  }
  // Check that the token was issued for the current tenant
  // Each tenant has a unique issuer.
  if (
    ctx.state.iguhealth.user.payload.iss !==
    TENANT_ISSUER(process.env.AUTH_ISSUER, ctx.state.iguhealth.tenant)
  ) {
    throw new OperationError(
      outcomeError(
        "security",
        `This token was not issued for the current tenant. '${ctx.state.iguhealth.user.payload.iss}' != '${TENANT_ISSUER(process.env.AUTH_ISSUER, ctx.state.iguhealth.tenant)}'`,
      ),
    );
  }

  if (
    typeof ctx.state.iguhealth.user?.payload.sub !== "string" ||
    typeof ctx.state.iguhealth.user?.payload.iss !== "string"
  )
    throw new OperationError(
      outcomeFatal("security", "JWT must have both sub and iss."),
    );

  await next();
}
