import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { AccessPolicy, id } from "@iguhealth/fhir-types/r4/types";
import { R4, Resource, ResourceType } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import getHardCodedClients from "../../authN/oidc/hardcodedClients/index.js";
import { IGUHealthServerCTX, asRoot } from "../../fhir-api/types.js";

async function findResourceAndAccessPolicies<Type extends ResourceType<R4>>(
  ctx: IGUHealthServerCTX,
  resourceType: Type,
  id: id,
): Promise<{
  resource?: Resource<R4, Type>;
  accessPolicies: AccessPolicy[];
}> {
  const clients = getHardCodedClients();

  // For hardcoded clients access check is needed
  // IE iguhealth system app and worker app.
  const hardCodedClient = clients.find(
    (client) => client.id === id && resourceType === client.resourceType,
  );
  if (hardCodedClient)
    return {
      resource: hardCodedClient as Resource<R4, Type>,
      accessPolicies: [],
    };

  const usersAndAccessPolicies = (await ctx.client.search_type(
    asRoot(ctx),
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
 * @param context IGUHealthServerCTX
 * @param next Next chain in middleware.
 * @returns IGUHealthServerCTX with user resource and access policies attached.
 */
export function createAssociateUserMiddleware<T>(): MiddlewareAsyncChain<
  T,
  IGUHealthServerCTX
> {
  return async (context, next) => {
    switch (context.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE]) {
      case "Membership":
      case "ClientApplication":
      case "OperationDefinition": {
        const { resource, accessPolicies } =
          await findResourceAndAccessPolicies(
            context.ctx,
            context.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
            context.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
          );
        return next({
          ...context,
          ctx: {
            ...context.ctx,
            user: {
              ...context.ctx.user,
              resource: resource ?? null,
              accessPolicies: accessPolicies ?? null,
            },
          },
        });
      }

      default:
        throw new OperationError(
          outcomeFatal(
            "invalid",
            `Invalid resource type set on JWT '${context.ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE]}'`,
          ),
        );
    }
  };
}
