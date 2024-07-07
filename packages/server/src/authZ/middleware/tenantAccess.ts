import Koa from "koa";

import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
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

  if (ctx.state.user?.[CUSTOM_CLAIMS.TENANT] !== ctx.state.iguhealth.tenant) {
    throw new OperationError(
      outcomeError(
        "security",
        `User is not authorized to access tenant ${ctx.params.tenant}`,
      ),
    );
  }

  if (
    typeof ctx.state.user?.sub !== "string" ||
    typeof ctx.state.user?.iss !== "string"
  )
    throw new OperationError(
      outcomeFatal("security", "JWT must have both sub and iss."),
    );

  ctx.state.iguhealth = {
    ...ctx.state.iguhealth,
    user: {
      jwt: ctx.state.user,
      accessToken: ctx.state.access_token,
    },
  };
  await next();
}
