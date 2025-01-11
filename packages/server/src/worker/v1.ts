// Backend Processes used for subscriptions and cron jobs.

import * as dateTzs from "@date-fns/tz";
import { randomUUID } from "crypto";
import * as dateFns from "date-fns";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  Bundle,
  BundleEntry,
  Parameters,
  Subscription,
  code,
  id,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
} from "@iguhealth/fhir-types/versions";
import * as fhirpath from "@iguhealth/fhirpath";
import { TenantId } from "@iguhealth/jwt";
import { createCertsIfNoneExists } from "@iguhealth/jwt/certifications";
import {
  OperationError,
  isOperationError,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { getActiveTenants } from "../authN/db/tenant.js";
import loadEnv from "../env.js";
import { httpRequestToFHIRRequest } from "../fhir-http/index.js";
import logAuditEvent, {
  MAJOR_FAILURE,
  SERIOUS_FAILURE,
  createAuditEvent,
} from "../fhir-logging/auditEvents.js";
import { resolveOperationDefinition } from "../fhir-operation-executors/utilities.js";
import { fitsSearchCriteria } from "../storage/clients/memory/search.js";
import { DBTransaction } from "../storage/transactions.js";
import { createResolverRemoteCanonical } from "../storage/utilities/canonical.js";
import {
  SearchParameterResource,
  deriveResourceTypeFilter,
  findSearchParameter,
  parametersWithMetaAssociated,
} from "../storage/utilities/search/parameters.js";
import * as Sentry from "../monitoring/sentry.js";
import { LIB_VERSION } from "../version.js";
import {
  ensureLocksCreated,
  getAvailableLocks,
  updateLock,
} from "./data/locks.js";
import {
  IGUHealthWorkerCTX,
  staticWorkerServices,
  tenantWorkerContext,
  workerTokenClaims,
} from "./utilities.js";

loadEnv();

if (process.env.NODE_ENV === "development") {
  await createCertsIfNoneExists(
    process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
    process.env.AUTH_LOCAL_SIGNING_KEY,
  );
}

if (process.env.SENTRY_WORKER_DSN)
  Sentry.enableSentry(process.env.SENTRY_WORKER_DSN, LIB_VERSION, {
    tracesSampleRate: parseFloat(
      process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1",
    ),
    profilesSampleRate: parseFloat(
      process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1",
    ),
  });

function getLatestTimestamp(
  resources: Resource<FHIR_VERSION, AllResourceTypes>[],
): Date {
  const result = dateFns.max(
    resources
      .map((resource) => resource.meta?.lastUpdated)
      .filter((date) => date !== undefined)
      .map((date) => dateFns.parseISO(date)),
  );
  return result;
}

async function handleSubscriptionPayload(
  ctx: IGUHealthWorkerCTX,
  fhirVersion: R4,
  subscription: Subscription,
  payload: Resource<FHIR_VERSION, AllResourceTypes>[],
): Promise<void> {
  const channelType = (
    await fhirpath.evaluate(
      "$this.channel.type | $this.channel.type.extension.where(url=%typeUrl).value",
      subscription,
      {
        variables: {
          typeUrl: "https://iguhealth.app/Subscription/channel-type",
        },
      },
    )
  )[0];

  switch (channelType) {
    case "rest-hook": {
      if (!subscription.channel.endpoint) {
        throw new OperationError(
          outcomeError("invalid", `Subscription channel is missing endpoint.`),
        );
      }

      const headers = subscription.channel.header
        ?.map((h) => h.split(":").map((h) => h.trim()))
        .reduce((acc: Record<string, string>, [key, value]) => {
          if (!key || !value) return acc;
          acc[key] = value;
          return acc;
        }, {});

      await Promise.all(
        payload.map((resource) =>
          fetch(subscription.channel.endpoint as string, {
            method: "POST",
            // headers: subscription.channel.header,
            headers: { ...headers, "Content-Type": "application/fhir+json" },
            body: JSON.stringify(resource),
          }).then((res) => {
            if (res.status >= 400) {
              throw new OperationError(
                outcomeError(
                  "exception",
                  "Failed to send message to endpoint.",
                ),
              );
            }
          }),
        ),
      );

      return;
    }
    case "operation": {
      const OPERATION_URL = "https://iguhealth.app/Subscription/operation-code";
      const operation = (
        await fhirpath.evaluate(
          "$this.channel.type.extension.where(url=%operationUrl).value",
          subscription,
          {
            variables: {
              operationUrl: OPERATION_URL,
            },
          },
        )
      )[0];
      if (typeof operation !== "string") {
        logAuditEvent(
          ctx.client,
          {},
          fhirVersion,
          createAuditEvent(
            ctx.user.payload,
            MAJOR_FAILURE,
            { reference: `Subscription/${subscription.id}` },
            `No Operation was specified, specifiy via extension '${OPERATION_URL}' with valueCode of operation code.`,
          ),
        );
        throw new OperationError(
          outcomeError("invalid", "Subscription contained invalid operation"),
        );
      }

      const operationDefinition = await resolveOperationDefinition(
        ctx.client,
        {},
        fhirVersion,
        operation,
      );

      const bundle: Bundle = {
        resourceType: "Bundle",
        type: "searchset" as code,
        entry: payload.map((resource) => ({
          resource: resource as Resource<R4, AllResourceTypes>,
        })),
      };

      await ctx.client.invoke_system(
        operationDefinition.code,
        {},
        fhirVersion,
        {
          resourceType: "Parameters",
          parameter: [
            {
              name: "input",
              resource: bundle,
            },
          ],
        } as Parameters,
      );

      return;
    }
    case "message": {
      if (!subscription.channel.endpoint) {
        throw new OperationError(
          outcomeError("invalid", `Subscription channel is missing endpoint.`),
        );
      }

      const bundle: Resource<FHIR_VERSION, "Bundle"> = {
        resourceType: "Bundle",
        type: "message",
        timestamp: new Date().toISOString(),
        entry: [
          {
            resource: {
              eventCoding: {
                system: "https://iguhealth.app",
                code: "subscription-message",
              },
              resourceType: "MessageHeader",
              source: {
                name: "worker",
                endpoint: `${subscription.resourceType}/${subscription.id}`,
              },
            } as Resource<R4, "MessageHeader">,
          },
          ...payload.map((resource) => ({
            resource,
          })),
        ],
      } as Resource<FHIR_VERSION, "Bundle">;

      const endpoint = subscription.channel.endpoint;
      const headers = subscription.channel.header
        ?.map((h) => h.split(":").map((h) => h.trim()))
        .reduce((acc: Record<string, string>, [key, value]) => {
          if (!key || !value) return acc;
          acc[key] = value;
          return acc;
        }, {});

      const response = await fetch(endpoint as string, {
        method: "POST",
        // headers: subscription.channel.header,
        headers: { ...headers, "Content-Type": "application/fhir+json" },
        body: JSON.stringify(bundle),
      });

      if (response.status >= 400) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Failed to send message to endpoint ${endpoint}.`,
          ),
        );
      }

      return;
    }

    default: {
      throw new OperationError(
        outcomeError(
          `not-supported`,
          `'${channelType}' is not supported for subscription.`,
        ),
      );
    }
  }
}

async function processSubscription(
  workerID: string,
  ctx: IGUHealthWorkerCTX,
  fhirVersion: FHIR_VERSION,
  lock: s.iguhealth_locks.Selectable,
) {
  if (fhirVersion !== R4)
    throw new OperationError(
      outcomeError(
        "not-supported",
        `FHIR version ${fhirVersion} is not supported.`,
      ),
    );

  // Reread here in event that concurrent process has altered the id.
  const subscription = await ctx.client.read(
    {},
    fhirVersion,
    "Subscription",
    lock.id as id,
  );
  if (!subscription)
    throw new OperationError(
      outcomeError("not-found", `Subscription with id '${lock.id}' not found.`),
    );
  if (subscription.status !== "active") return;

  const logger = ctx.logger.child({
    worker: workerID,
    tenant: ctx.tenant,
    criteria: subscription.criteria,
  });

  try {
    // Only doing r4 for Subs right now.
    const request = httpRequestToFHIRRequest("r4", {
      url: subscription.criteria,
      method: "GET",
    });

    if (request.type !== "search-request") {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Criteria must be a search request but found ${request.type}`,
        ),
      );
    }

    if (request.fhirVersion !== R4) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Criteria must be a search request for FHIR version 4.0 but found ${request.fhirVersion}`,
        ),
      );
    }

    const sortParameter = request.parameters.find((p) => p.name === "_sort");

    if (sortParameter) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Criteria cannot include _sort. Sorting must be based order resource was updated.`,
        ),
      );
    }

    const latestDateStampForSub: string = lock.value?.toString() ?? "";

    let parsedDate: Date | dateTzs.TZDate | undefined = FORMAT.map((f) =>
      dateFns.parse(latestDateStampForSub, f, new dateTzs.TZDate()),
    ).find((f) => dateFns.isValid(f));

    if (parsedDate === undefined) {
      parsedDate = dateFns.parse(
        subscription.meta?.lastUpdated as string,
        MILLISECOND_FORMAT,
        new dateTzs.TZDate(),
      );
    }

    let historyPoll: (BundleEntry | r4b.BundleEntry)[] = [];

    switch (request.level) {
      case "system": {
        historyPoll = await ctx.client.history_system({}, fhirVersion, [
          {
            name: "_since",
            value: [dateFns.format(parsedDate, SECOND_FORMAT)],
          },
        ]);
        break;
      }
      case "type": {
        historyPoll = await ctx.client.history_type(
          {},
          fhirVersion,
          request.resource,
          [
            {
              name: "_since",
              value: [dateFns.format(parsedDate, SECOND_FORMAT)],
            },
          ],
        );
        break;
      }
    }

    // Because precision is not too the millisecond perform additional filter here.
    historyPoll = historyPoll
      .filter((r) =>
        dateFns.isAfter(
          dateFns.parse(
            r.resource?.meta?.lastUpdated as string,
            MILLISECOND_FORMAT,
            new dateTzs.TZDate(),
          ),
          parsedDate,
        ),
      )
      .reverse();

    const resourceTypes = deriveResourceTypeFilter(request);
    // Remove _type as using on derived resourceTypeFilter
    request.parameters = request.parameters.filter((p) => p.name !== "_type");

    const parameters = await parametersWithMetaAssociated(
      async (resourceTypes, name) =>
        await findSearchParameter(
          ctx.client,
          {},
          fhirVersion,
          resourceTypes,
          name,
        ),
      resourceTypes,
      request.parameters,
    );

    // Standard parameters
    const resourceParameters = parameters.filter(
      (v): v is SearchParameterResource => v.type === "resource",
    );

    if (historyPoll.length > 0) {
      logger.info(`PROCESSING Subscription '${subscription.id}'`);
      if (historyPoll[0].resource === undefined)
        throw new OperationError(
          outcomeError(
            "invalid",
            "history poll returned entry missing resource.",
          ),
        );

      // Do reverse as ordering is the latest update first.
      const payload: Resource<R4, AllResourceTypes>[] = [];

      for (const entry of historyPoll) {
        if (entry.resource === undefined)
          throw new OperationError(
            outcomeError(
              "invalid",
              "history poll returned entry missing resource.",
            ),
          );

        if (
          entry.resource &&
          (await fitsSearchCriteria(
            {
              resolveCanonical: ctx.resolveCanonical,
              resolveTypeToCanonical: ctx.resolveTypeToCanonical,
              resolveRemoteCanonical: createResolverRemoteCanonical(
                ctx.client,
                {},
              ),
            },
            R4,
            entry.resource,
            resourceParameters,
          ))
        ) {
          payload.push(entry.resource as Resource<R4, AllResourceTypes>);
        }
      }
      if (payload.length > 0) {
        await handleSubscriptionPayload(
          ctx,
          fhirVersion,
          subscription,
          payload,
        );
      }

      await updateLock(
        ctx.store.getClient(),
        ctx.tenant,
        "old_subscription",
        lock.id,
        {
          value: JSON.stringify(
            dateFns.format(
              dateFns.max([
                parsedDate,
                getLatestTimestamp([
                  historyPoll[historyPoll.length - 1].resource as Resource<
                    R4,
                    AllResourceTypes
                  >,
                ]),
                1,
              ]),
              MILLISECOND_FORMAT,
            ),
          ),
        },
      );
    }
  } catch (e) {
    logger.error(e);
    Sentry.logError(e);
    let errorDescription = "Subscription failed to process";

    if (isOperationError(e)) {
      errorDescription = e.outcome.issue.map((i) => i.details).join(". ");
    }

    await logAuditEvent(
      ctx.client,
      {},
      fhirVersion,
      createAuditEvent(
        ctx.user.payload,
        SERIOUS_FAILURE,
        { reference: `Subscription/${subscription.id}` },
        errorDescription,
      ),
    );

    await ctx.client.update(
      {},
      fhirVersion,
      "Subscription",
      subscription.id as id,
      {
        ...subscription,
        status: "error" as code,
      },
    );
  }
}

const MILLISECOND_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
const SECOND_FORMAT = "yyyy-MM-dd'T'HH:mm:ssXXX";
const FORMAT = [SECOND_FORMAT, MILLISECOND_FORMAT];

async function createWorker(
  workerID = randomUUID(),
  fhirVersion: FHIR_VERSION = R4,
  loopInterval = 500,
) {
  const services = await staticWorkerServices(workerID);

  let isRunning = true;
  const tenantOffsets: Record<TenantId, Date | null | undefined> = {};
  const totalSubsProcessAtATime = 5;

  services.logger.info(`Worker started with interval '${loopInterval}'`);

  setTimeout(async () => {
    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    while (isRunning) {
      try {
        const activeTenants = await getActiveTenants(
          services.store.getClient(),
        );
        for (const tenant of activeTenants) {
          const tenantClaims = workerTokenClaims(workerID, tenant);

          const ctx: IGUHealthWorkerCTX = tenantWorkerContext(
            services,
            tenant,
            tenantClaims,
          );

          const dateOffsetString: string = tenantOffsets[tenant]
            ? dateFns.format(tenantOffsets[tenant], SECOND_FORMAT)
            : dateFns.format(dateFns.fromUnixTime(0), SECOND_FORMAT);

          const activeSubscriptions = (
            await ctx.client.search_type({}, fhirVersion, "Subscription", [
              { name: "status", value: ["active"] },
              { name: "_count", value: [totalSubsProcessAtATime] },
              {
                name: "_lastUpdated",
                value: [`gt${dateOffsetString}`],
              },
            ])
          ).resources;

          tenantOffsets[tenant] =
            // If less than totalSubsProcessAtATime count, then we have reached the end of list of active subscriptions.
            // Set back to zero to loop over all active subscriptions again.
            activeSubscriptions.length < totalSubsProcessAtATime
              ? dateFns.fromUnixTime(0)
              : getLatestTimestamp(activeSubscriptions);

          await ensureLocksCreated(
            ctx.store.getClient(),
            activeSubscriptions.map((sub) => ({
              id: sub.id as string,
              type: "old_subscription",
              fhir_version: fhirVersion,
              tenant: ctx.tenant,
              value: JSON.stringify(sub.meta?.lastUpdated),
            })),
          );

          await DBTransaction(
            ctx,
            db.IsolationLevel.RepeatableRead,
            async (txContext) => {
              const locks = await getAvailableLocks(
                txContext.store.getClient(),
                txContext.tenant,
                "old_subscription",
                activeSubscriptions.map((sub) => sub.id as string),
              );

              await Promise.all(
                locks.map((lock) =>
                  processSubscription(workerID, txContext, fhirVersion, lock),
                ),
              );
            },
          );
        }
      } catch (e) {
        services.logger.error(e);
      } finally {
        await new Promise((resolve) => setTimeout(resolve, loopInterval));
      }
    }
  });
  return async () => {
    isRunning = false;
  };
}

export default createWorker;
