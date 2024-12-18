import * as s from "zapatos/schema";

import accessPolicyV2 from "@iguhealth/access-control/v2";
import {
  ClientApplication,
  Membership,
  OperationDefinition,
  Reference,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthEvaluatePolicy } from "@iguhealth/generated-ops/r4";
import { AccessTokenPayload, CUSTOM_CLAIMS, Subject } from "@iguhealth/jwt";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { getIssuer } from "../../../../authN/oidc/constants.js";
import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import { httpRequestToFHIRRequest } from "../../../../fhir-http/index.js";
import InlineOperation from "../interface.js";

async function getUserSource(
  ctx: IGUHealthServerCTX,

  userRef: Reference | undefined,
): Promise<{
  payload: AccessTokenPayload<s.user_role>;
  resource: Membership | ClientApplication | OperationDefinition;
}> {
  if (!userRef)
    return {
      payload: ctx.user.payload,
      resource: ctx.user.resource,
    };
  const [userType, userId] = userRef.reference?.split("/") ?? [];
  if (
    userId === undefined ||
    (userType !== "ClientApplication" &&
      userType !== "Membership" &&
      userType !== "OperationDefinition")
  ) {
    throw new OperationError(
      outcomeError("exception", "Invalid user reference"),
    );
  }

  const resource = await ctx.client.read(ctx, R4, userType, userId as id);
  if (!resource) {
    throw new OperationError(outcomeError("exception", "User not found"));
  }

  const policies = await ctx.client.search_type(ctx, R4, "AccessPolicyV2", [
    {
      name: "link",
      value: [userId],
    },
  ]);

  return {
    payload: {
      iss: getIssuer(ctx.tenant),
      aud: "policy-test",
      [CUSTOM_CLAIMS.TENANT]: ctx.tenant,
      [CUSTOM_CLAIMS.ROLE]:
        "role" in resource ? (resource.role as s.user_role) : "member",
      [CUSTOM_CLAIMS.RESOURCE_TYPE]: "ClientApplication",
      [CUSTOM_CLAIMS.RESOURCE_ID]: resource.id as id,
      [CUSTOM_CLAIMS.RESOURCE_VERSION_ID]: resource.meta?.versionId as id,
      [CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS]: policies.resources
        .map((p) => p.meta?.versionId)
        .filter((v) => v !== undefined),
      scope: "user/*.*",
      sub: resource.id as string as Subject,
    },
    resource: resource,
  };
}

export const EvaluatePolicyInvoke = InlineOperation(
  IguhealthEvaluatePolicy.Op,
  async (ctx, request, input) => {
    const url = input.request.entry?.[0]?.request?.url;
    const method = input.request.entry?.[0]?.request?.method;
    const body = input.request.entry?.[0]?.resource;

    if (!url || !method) {
      throw new OperationError(outcomeError("exception", "Invalid request"));
    }

    switch (request.level) {
      case "instance": {
        const policy = await ctx.client.read(
          ctx,
          request.fhirVersion,
          "AccessPolicyV2",
          request.id,
        );

        if (!policy) {
          throw new OperationError(
            outcomeFatal("not-found", "AccessPolicyV2 not found"),
          );
        }

        const result = await accessPolicyV2(
          {
            clientCTX: ctx,
            client: ctx.client,
            environment: {
              user: await getUserSource(ctx, input.user),
              request: httpRequestToFHIRRequest(request.fhirVersion, {
                url,
                method,
                body,
              }),
            },
            attributes: {},
          },
          [policy],
        );

        return result;
      }
      default: {
        throw new OperationError(
          outcomeFatal(
            "invalid",
            "Operation must be invoked on AccessPolicyV2 instance.",
          ),
        );
      }
    }
  },
);
