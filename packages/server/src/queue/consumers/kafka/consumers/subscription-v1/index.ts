import { KafkaMessage } from "kafkajs";

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
  createClient,
  createLogger,
} from "../../../../../fhir-server/index.js";
import resolveCanonical from "../../../../../fhir-server/resolvers/resolveCanonical.js";
import {
  IGUHealthServerCTX,
  asRoot,
} from "../../../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../../../fhir-terminology/index.js";
import createResourceStore from "../../../../../resource-stores/index.js";
import { createResolverRemoteCanonical } from "../../../../../search-stores/canonical.js";
import { createSearchStore } from "../../../../../search-stores/index.js";
import {
  deriveResourceTypeFilter,
  parametersWithMetaAssociated,
} from "../../../../../search-stores/parameters.js";
import createQueue from "../../../../providers/index.js";
import * as queue from "../../../../providers/interface.js";
import { Consumers } from "../../../../topics/index.js";
import {
  OperationsTopic,
  TENANT_TOPIC_PATTERN,
} from "../../../../topics/tenant-topics.js";
import { workerTokenClaims } from "../../../utilities.js";
import createKafkaConsumer from "../../local.js";
import { BatchHandler } from "../../types.js";
import { getTenantId } from "../../utilities.js";
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
      asRoot(ctx),
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
              ctx,
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

    await handleSubscriptionPayload(asRoot(ctx), R4, subscription, payload);
  } catch (e) {
    let errorDescription = "Subscription failed to process";
    if (isOperationError(e)) {
      errorDescription = e.outcome.issue.map((i) => i.details).join(". ");
    }
    await logAuditEvent(
      ctx.client,
      ctx,
      R4,
      createAuditEvent(
        workerTokenClaims("subscription-v1", ctx.tenant),
        SERIOUS_FAILURE,
        { reference: `Subscription/${subscription.id}` },
        errorDescription,
      ),
    );

    await ctx.client.update(
      asRoot(ctx),
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

type NonNullableValue = KafkaMessage & {
  value: NonNullable<KafkaMessage["value"]>;
};

function filterNullableMessages(m: KafkaMessage): m is NonNullableValue {
  return m.value !== null;
}

const handler: BatchHandler<
  Omit<IGUHealthServerCTX, "user" | "tenant">
> = async (iguhealthServices, { batch }) => {
  iguhealthServices.logger.info(
    `[subscription-v1], Processing batch ${batch.messages?.[0].key?.toString()}`,
  );

  const tenant = getTenantId(batch.messages?.[0]);

  const subscriptions = await iguhealthServices.client.search_type(
    asRoot({ ...iguhealthServices, tenant }),
    R4,
    "Subscription",
    [
      { name: "status", value: ["active"] },
      { name: "_count", value: [TOTAL_SUBS_PROCESS] },
    ],
  );

  const operations: queue.Operations = batch.messages
    ?.filter(filterNullableMessages)
    .map((m) => JSON.parse(m.value.toString()) as queue.Operations[number])
    .flat();

  for (const subscription of subscriptions.resources) {
    processSubscription(
      asRoot({ ...iguhealthServices, tenant }),
      subscription,
      operations,
    );
  }
};

export default async function createSubscriptionV1Worker() {
  const iguhealthServices: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    queue: await createQueue(),
    store: await createResourceStore({ type: "postgres" }),
    search: await createSearchStore({ type: "postgres" }),
    logger: createLogger(),
    terminologyProvider: new TerminologyProvider(),
    client: createClient(),
    resolveCanonical,
  };

  const stop = await createKafkaConsumer(
    iguhealthServices,
    TENANT_TOPIC_PATTERN(OperationsTopic),
    Consumers.SubscriptionV1,
    {
      eachBatch: async (ctx, { batch }) => {
        try {
          await handler(ctx, { batch });
        } catch (e) {
          console.error(e);
        }
      },
    },
  );

  return stop;
}
