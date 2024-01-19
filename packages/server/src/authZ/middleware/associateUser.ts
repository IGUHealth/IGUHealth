import { MiddlewareAsync } from "@iguhealth/client/middleware";
import { escapeParameter } from "@iguhealth/client/url";
import { AccessPolicy, User } from "@iguhealth/fhir-types/r4/types";

import { FHIRServerCTX, asSystemCTX } from "../../fhir/context.js";

/**
 * Middleware to associate the user and access policies with the request.
 * Middlware uses JWT iss and sub to find the user resource and _revinclude to find the access policies.
 *
 * @param context FHIRServerCTX
 * @param next Next chain in middleware.
 * @returns FHIRServerCTX with user resource and access policies attached.
 */
export const associateUserMiddleware: MiddlewareAsync<
  unknown,
  FHIRServerCTX
> = async (context, next) => {
  if (!next) throw new Error("next middleware was not defined");

  const usersAndAccessPolicies = (await context.ctx.client.search_type(
    asSystemCTX(context.ctx),
    "User",
    [
      {
        name: "identifier",
        value: [
          `${escapeParameter(context.ctx.user.jwt.iss)}|${escapeParameter(
            context.ctx.user.jwt.sub,
          )}`,
        ],
      },
      { name: "_revinclude", value: ["AccessPolicy:link"] },
    ],
  )) as {
    total?: number;
    resources: (User | AccessPolicy)[];
  };

  const userResource = usersAndAccessPolicies.resources.filter(
    (r): r is User => r.resourceType === "User",
  );

  const accessPolicies = usersAndAccessPolicies.resources.filter(
    (r): r is AccessPolicy => r.resourceType === "AccessPolicy",
  );

  return next({
    ...context,
    ctx: {
      ...context.ctx,
      user: {
        ...context.ctx.user,
        resource: userResource[0] || null,
        accessPolicies: accessPolicies || null,
      },
    },
  });
};
