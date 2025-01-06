import { randomUUID } from "crypto";
import * as db from "zapatos/db";

import { Basic, code, id } from "@iguhealth/fhir-types/r4/types";
import { SubscriptionTopic } from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, R4 } from "@iguhealth/fhir-types/versions";
import { evaluate } from "@iguhealth/fhirpath";
import { TenantId } from "@iguhealth/jwt";

import { Transaction } from "../../storage/transactions.js";
import { ensureLocksCreated, getAvailableLocks } from "../data/locks.js";
import {
  IGUHealthWorkerCTX,
  WorkerClient,
  WorkerClientCTX,
  staticWorkerServices,
  tenantWorkerContext,
  workerTokenClaims,
} from "../utilities.js";
import { getActiveTenants } from "../../authN/db/tenant.js";

type SubscriptionTopicVersion<FHIR_VERSION> = FHIR_VERSION extends R4
  ? Basic
  : SubscriptionTopic;

async function retrieveActiveSubscriptionTopics<Version extends FHIR_VERSION>(
  ctx: WorkerClientCTX,
  client: WorkerClient,
  fhirVersion: Version,
): Promise<SubscriptionTopicVersion<Version>[]> {
  switch (fhirVersion) {
    case R4: {
      const basicTopics = await client
        .search_type(ctx, R4, "Basic", [
          {
            name: "profile",
            value: [
              "http://hl7.org/fhir/StructureDefinition/SubscriptionTopic",
            ],
          },
          { name: "subscriptiontopic-status", value: ["active"] },
          { name: "_count", value: ["1000"] },
        ])
        .then((res) => res.resources);

      return basicTopics as SubscriptionTopicVersion<Version>[];
    }
    default: {
      throw new Error(`Unsupported FHIR version: '${fhirVersion}'`);
    }
  }
}

async function processSubscriptionTopic<Version extends FHIR_VERSION>(
  services: IGUHealthWorkerCTX,
  fhirVersion: Version,
  subscriptionTopic: SubscriptionTopicVersion<Version>,
) {
  switch (fhirVersion) {
    case R4: {
      const resourceTrigger = subscriptionTopic.extension?.find(
        (ext) =>
          ext.url ===
          "http://hl7.org/fhir/5.0/StructureDefinition/extension-SubscriptionTopic.resourceTrigger",
      );

      if (resourceTrigger) {
        const resources: code[] = (await evaluate(
          "$this.extension.where(url=%extUrl).value",
          resourceTrigger,
          {
            variables: {
              extUrl:
                "http://hl7.org/fhir/5.0/StructureDefinition/extension-SubscriptionTopic.resourceTrigger.resource",
            },
          },
        )) as code[];

        const interactions: code[] = (await evaluate(
          "$this.extension.where(url=%extUrl).value",
          resourceTrigger,
          {
            variables: {
              extUrl:
                "http://hl7.org/fhir/5.0/StructureDefinition/extension-SubscriptionTopic.resourceTrigger.supportedInteraction",
            },
          },
        )) as code[];
      }
      return;
    }
    default: {
      throw new Error(`Unsupported FHIR version: '${fhirVersion}'`);
    }
  }
}

async function processTenant<Version extends FHIR_VERSION>(
  services: Omit<IGUHealthWorkerCTX, "tenant" | "user" | "client">,
  tenant: TenantId,
  fhirVersion: Version,
) {
  const payload = workerTokenClaims(services.workerID, tenant);
  const workerContext = tenantWorkerContext(services, tenant, payload);

  const subscriptionTopics: SubscriptionTopicVersion<Version>[] =
    await retrieveActiveSubscriptionTopics(
      {},
      workerContext.client,
      fhirVersion,
    );

  await ensureLocksCreated(
    workerContext.db,
    subscriptionTopics.map((st) => ({
      id: st.id as string,
      type: "subscriptiontopic",
      fhir_version: fhirVersion,
      tenant: workerContext.tenant,
      value: st.meta?.versionId as string,
    })),
  );

  await Transaction(
    workerContext,
    db.IsolationLevel.RepeatableRead,
    async (tenantContext) => {
      const locksRetrieved = await getAvailableLocks(
        tenantContext.db,
        tenantContext.tenant,
        "subscriptiontopic",
        subscriptionTopics.map((st) => st.id as string),
      );

      const allowedSubTopics = subscriptionTopics.filter((st) =>
        locksRetrieved.some((lock) => lock.id === st.id),
      );

      const processedTopics: Record<id, Promise<void>> = {};
      for (const subscriptionTopic of allowedSubTopics) {
        if (
          subscriptionTopic.id &&
          !(subscriptionTopic.id in processedTopics)
        ) {
          processedTopics[subscriptionTopic.id] = processSubscriptionTopic(
            tenantContext,
            fhirVersion,
            subscriptionTopic,
          ).finally(() => {
            delete processedTopics[subscriptionTopic.id as id];
          });
        }
      }
    },
  );
}

/**
 * Loops over history and filters to send messages to queue.
 * @param workerID The workers ID for logging
 * @param fhirVersion the FHIR version to use
 * @param loopInterval the loop interval in milliseconds
 */
export default async function subscriptionTopicWorker(
  workerID = randomUUID(),
  fhirVersion: FHIR_VERSION = R4,
  loopInterval = 500,
) {
  let isRunning = true;
  const services = staticWorkerServices(workerID);

  while (isRunning) {
    try {
      const activeTenants = await getActiveTenants(services.db);
      const executingTenants: Record<TenantId, Promise<void>> = {};
      for (const tenant of activeTenants) {
        // Only process tenant if not already processing.
        if (!(tenant in executingTenants)) {
          executingTenants[tenant] = processTenant(
            services,
            tenant,
            fhirVersion,
          ).finally(() => {
            delete executingTenants[tenant];
          });
        }
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, loopInterval));
    }
  }

  return () => {
    isRunning = false;
  };
}
