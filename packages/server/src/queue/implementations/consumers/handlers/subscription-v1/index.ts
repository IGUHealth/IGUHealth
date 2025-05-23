import { FHIRRequest } from "@iguhealth/client/lib/types";
import { SearchParameterResource } from "@iguhealth/client/lib/url";
import { code, id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { AllResourceTypes, R4, Resource } from "@iguhealth/fhir-types/versions";
import {
  OperationError,
  isOperationError,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { fitsSearchCriteria } from "../../../../../fhir-clients/clients/memory/search.js";
import { httpRequestToFHIRRequest } from "../../../../../fhir-http/index.js";
import logAuditEvent, {
  SERIOUS_FAILURE,
  createAuditEvent,
} from "../../../../../fhir-logging/auditEvents.js";
import {
  IGUHealthServerCTX,
  IGUHealthServices,
  asRoot,
} from "../../../../../fhir-server/types.js";
import { createResolverRemoteCanonical } from "../../../../../search-stores/canonical.js";
import {
  deriveResourceTypeFilter,
  parametersWithMetaAssociated,
} from "../../../../../search-stores/parameters.js";
import * as queue from "../../../providers/interface.js";
import { Message, MessageHandler } from "../../types.js";
import { workerTokenClaims } from "../../utilities.js";
import { getTenantId } from "../utilities.js";
import { handleSubscriptionPayload } from "./handle-payload.js";

async function processSubscription(
  ctx: Omit<IGUHealthServerCTX, "user">,
  subscription: Resource<R4, "Subscription">,
  mutations: queue.Operations,
) {
  try {
    const request = httpRequestToFHIRRequest("r4", {
      url: subscription.criteria,
      method: "GET",
    }) as FHIRRequest<R4, "search">;

    const sortParameter = request.parameters.find((p) => p.name === "_sort");

    if (sortParameter) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Criteria cannot include _sort. Sorting must be based order resource was updated.`,
        ),
      );
    }

    const resourceTypes = deriveResourceTypeFilter(request);
    // Remove _type as using on derived resourceTypeFilter
    request.parameters = request.parameters.filter((p) => p.name !== "_type");

    const parameters = await parametersWithMetaAssociated(
      await asRoot(ctx),
      request.fhirVersion,
      resourceTypes,
      request.parameters,
    ); // Standard parameters

    const resourceParameters = parameters.filter(
      (v): v is SearchParameterResource<R4> => v.type === "resource",
    );

    const resources = mutations
      .filter(
        (m): m is queue.Operation<R4, queue.MutationTypes> =>
          m.fhirVersion === R4,
      )
      .map((m) => {
        switch (m.response?.type) {
          case "create-response":
          case "update-response":
          case "patch-response":
            return [m.response.body];
          case "delete-response": {
            switch (m.response.level) {
              case "instance":
                return [m.response.deletion];
              case "type":
              case "system":
                return m.response.deletion;
              default: {
                return [];
              }
            }
          }
          default: {
            return [];
          }
        }
      })
      .flat()
      .filter((resource) => resource !== undefined)
      .filter((resource) => {
        if (resourceTypes.length === 0) return true;
        return resourceTypes.includes(resource.resourceType);
      });

    const payload: Resource<R4, AllResourceTypes>[] = [];

    for (const resource of resources) {
      if (
        await fitsSearchCriteria(
          {
            resolveCanonical: ctx.resolveCanonical,
            resolveRemoteCanonical: createResolverRemoteCanonical(
              ctx.client,
              await asRoot(ctx),
            ),
          },
          R4,
          resource,
          resourceParameters,
        )
      ) {
        payload.push(resource);
      }
    }

    await handleSubscriptionPayload(
      await asRoot(ctx),
      R4,
      subscription,
      payload,
    );
  } catch (e) {
    ctx.logger.error(e);
    let errorDescription = "Subscription failed to process";
    if (isOperationError(e)) {
      errorDescription = e.outcome.issue.map((i) => i.details).join(". ");
    }
    await logAuditEvent(
      ctx.client,
      await asRoot(ctx),
      R4,
      createAuditEvent(
        await workerTokenClaims(ctx.config, "subscription-v1", ctx.tenant),
        SERIOUS_FAILURE,
        { reference: `Subscription/${subscription.id}` },
        errorDescription,
      ),
    );

    await ctx.client.update(
      await asRoot(ctx),
      R4,
      "Subscription",
      subscription.id as id,
      {
        ...subscription,
        status: "error" as code,
      },
    );
  }
}

const TOTAL_SUBS_PROCESS = 1000;

type NonNullableValue = Message & {
  value: NonNullable<Message["value"]>;
};

function filterNullableMessages(m: Message): m is NonNullableValue {
  return m.value !== null;
}

const handler: MessageHandler<IGUHealthServices> = async (
  iguhealthServices,
  { messages },
) => {
  iguhealthServices.logger.info(
    `[subscription-v1], Processing batch ${messages?.[0].key}`,
  );

  const tenant = getTenantId(messages?.[0]);

  const subscriptions = await iguhealthServices.client.search_type(
    await asRoot({ ...iguhealthServices, tenant }),
    R4,
    "Subscription",
    [
      { name: "status", value: ["active"] },
      { name: "_count", value: [TOTAL_SUBS_PROCESS] },
    ],
  );

  const operations: queue.Operations = messages
    ?.filter(filterNullableMessages)
    .map((m) => m.value as queue.Operations[number])
    .flat();

  for (const subscription of subscriptions.resources) {
    processSubscription(
      await asRoot({ ...iguhealthServices, tenant }),
      subscription,
      operations,
    );
  }
};

export default handler;
