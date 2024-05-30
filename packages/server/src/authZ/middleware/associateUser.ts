import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { AccessPolicy, id } from "@iguhealth/fhir-types/r4/types";
import { R4, Resource, ResourceType } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX, asSystemCTX } from "../../fhir-api/types.js";

// const membershipID = ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_ID] as
// | id
// | undefined;

async function findResourceAndAccessPolicies<Type extends ResourceType<R4>>(
  ctx: FHIRServerCTX,
  resourceType: Type,
  id: id,
): Promise<{
  resource?: Resource<R4, Type>;
  accessPolicies: AccessPolicy[];
}> {
  const usersAndAccessPolicies = (await ctx.client.search_type(
    asSystemCTX(ctx),
    R4,
    resourceType,
    [
      {
        name: "_id",
        value: [id],
      },
      { name: "_revinclude", value: ["AccessPolicy:link"] },
    ],
  )) as {
    total?: number;
    resources: (Resource<R4, Type> | AccessPolicy)[];
  };

  const resource = usersAndAccessPolicies.resources.filter(
    (r): r is Resource<R4, Type> => r.resourceType === resourceType,
  );

  const accessPolicies = usersAndAccessPolicies.resources.filter(
    (r): r is AccessPolicy => r.resourceType === "AccessPolicy",
  );

  return {
    resource: resource[0],
    accessPolicies,
  };
}

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
    case "Membership":
    case "ClientApplication":
    case "OperationDefinition": {
      const { resource: membership, accessPolicies } =
        await findResourceAndAccessPolicies(
          context.ctx,
          context.ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_TYPE],
          context.ctx.user.jwt[CUSTOM_CLAIMS.RESOURCE_ID],
        );
      return next({
        ...context,
        ctx: {
          ...context.ctx,
          user: {
            ...context.ctx.user,
            resource: membership ?? null,
            accessPolicies: accessPolicies ?? null,
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
