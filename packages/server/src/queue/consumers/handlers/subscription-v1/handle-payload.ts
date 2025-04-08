import {
  Bundle,
  Parameters,
  Subscription,
  code,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
} from "@iguhealth/fhir-types/versions";
import * as fhirpath from "@iguhealth/fhirpath";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import logAuditEvent, {
  MAJOR_FAILURE,
  createAuditEvent,
} from "../../../../fhir-logging/auditEvents.js";
import { resolveOperationDefinition } from "../../../../fhir-operation-executors/utilities.js";
import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";

export async function handleSubscriptionPayload(
  ctx: IGUHealthServerCTX,
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
          ctx,
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
        ctx,
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
        ctx,
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
