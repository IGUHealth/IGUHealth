import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { AccessPolicy, Membership, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX, asSystemCTX } from "../../fhir-api/types.js";

/**
 * Middleware to associate the user and access policies with the request.
 * Middlware uses JWT iss and sub to find the contextual user resource and _revinclude to find the access policies.
 *
 * @param context FHIRServerCTX
 * @param next Next chain in middleware.
 * @returns FHIRServerCTX with user resource and access policies attached.
 */
export const associateUserMiddleware: MiddlewareAsyncChain<
  unknown,
  FHIRServerCTX
> = async (context, next) => {
  switch (context.ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_TYPE]) {
    case "Membership": {
      const usersAndAccessPolicies = (await context.ctx.client.search_type(
        asSystemCTX(context.ctx),
        R4,
        "Membership",
        [
          {
            name: "_id",
            value: [context.ctx.user.jwt.sub],
          },
          { name: "_revinclude", value: ["AccessPolicy:link"] },
        ],
      )) as {
        total?: number;
        resources: (Membership | AccessPolicy)[];
      };

      const userResource = usersAndAccessPolicies.resources.filter(
        (r): r is Membership => r.resourceType === "Membership",
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
    }

    case "ClientApplication": {
      const clientApplication = await context.ctx.client.read(
        asSystemCTX(context.ctx),
        R4,
        "ClientApplication",
        context.ctx.user.jwt.sub as string as id,
      );

      const accessPolicies = await context.ctx.client.search_type(
        asSystemCTX(context.ctx),
        R4,
        "AccessPolicy",
        [
          {
            name: "link",
            value: [`ClientApplication/${context.ctx.user.jwt.sub}`],
          },
        ],
      );

      return next({
        ...context,
        ctx: {
          ...context.ctx,
          user: {
            ...context.ctx.user,
            resource: clientApplication,
            accessPolicies: accessPolicies.resources,
          },
        },
      });
    }
    case "OperationDefinition": {
      const operationDefinition = await context.ctx.client.read(
        asSystemCTX(context.ctx),
        R4,
        "OperationDefinition",
        context.ctx.user.jwt.sub as string as id,
      );

      const accessPolicies = await context.ctx.client.search_type(
        asSystemCTX(context.ctx),
        R4,
        "AccessPolicy",
        [
          {
            name: "link",
            value: [`OperationDefinition/${context.ctx.user.jwt.sub}`],
          },
        ],
      );

      return next({
        ...context,
        ctx: {
          ...context.ctx,
          user: {
            ...context.ctx.user,
            resource: operationDefinition,
            accessPolicies: accessPolicies.resources,
          },
        },
      });
    }
    default:
      throw new OperationError(
        outcomeFatal(
          "invalid",
          `Invalid resource type set on JWT '${context.ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_TYPE]}'`,
        ),
      );
  }
};
