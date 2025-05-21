import { R4 } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asRoot } from "../../../fhir-server/types.js";
import { OIDCRouteHandler } from "../index.js";

type UserInfoResponse = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
};

export function userInfo(): OIDCRouteHandler {
  return async (ctx, next) => {
    if (!ctx.state.iguhealth.user) {
      throw new OperationError(
        outcomeError("forbidden", "User is not authenticated."),
      );
    }

    const membership = await ctx.state.iguhealth.client.read(
      await asRoot(ctx.state.iguhealth),
      R4,
      "Membership",
      ctx.state.iguhealth.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
    );

    ctx.body = {
      sub: membership?.id,
      given_name: membership?.name?.given?.join(" "),
      family_name: membership?.name?.family,
      email: membership?.email,
    } as UserInfoResponse;

    await next();
  };
}
