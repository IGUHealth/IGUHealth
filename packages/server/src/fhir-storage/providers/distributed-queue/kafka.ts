import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClient } from "@iguhealth/client/lib/interface";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import { generateId } from "../../utilities/generateId.js";
import { Kafka, KafkaConfig, Producer } from "kafkajs";
import { validateResource } from "../../../fhir-operation-executors/providers/local/index.js";
import * as jsonpatch from "fast-json-patch";

// const producer = kafka.producer();

type KafkaState = {
  client: InstanceType<typeof Kafka>;
  producer: Producer;
  topic: string;
};

function createKafkaMiddleware<
  State extends KafkaState,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      switch (context.request.type) {
        case "patch-request": {
          const existingResource = await context.ctx.client.read(
            context.ctx,
            context.request.fhirVersion,
            context.request.resource,
            context.request.id,
          );
          if (!existingResource) {
            throw new OperationError(
              outcomeError(
                "not-found",
                `'${context.request.resource}' with id '${context.request.id}' was not found`,
              ),
            );
          }
          const newResource = (await jsonpatch.applyPatch(
            existingResource,
            context.request.body as jsonpatch.Operation[],
            true,
            false,
          ).newDocument) as Resource<FHIR_VERSION, AllResourceTypes>;

          const outcome = await validateResource(
            context.ctx,
            context.request.fhirVersion,
            context.request.resource,
            {
              resource: newResource,
            },
          );
          // Need to revaluate post application of patch to ensure that the resource is still valid.
          if (
            outcome.issue.filter(
              (i) => i.severity === "error" || i.severity === "fatal",
            ).length > 0
          ) {
            throw new OperationError(outcome);
          }
          if (newResource.id !== existingResource.id) {
            newResource.id = existingResource.id;
          }

          const request = {
            type: "update-request",
            level: "instance",
            fhirVersion: context.request.fhirVersion,
            resource: context.request.resource,
            id: context.request.id,
            body: newResource,
          } as FHIRRequest;

          await context.state.producer.send({
            topic: context.state.topic,
            messages: [
              {
                value: JSON.stringify(request),
              },
            ],
          });
          return {
            ...context,
            response: {
              type: "patch-response",
              level: "instance",
              fhirVersion: context.request.fhirVersion,
              resource: context.request.resource,
              id: context.request.id,
              body: newResource,
            } as FHIRResponse,
          };
        }
        case "update-request": {
          throw new OperationError(
            outcomeError(
              "not-supported",
              "Operation 'update-request' not supported on kafka provider.",
            ),
          );
        }
        case "create-request": {
          const id = generateId();
          const resource = { ...context.request.body, id };
          const request = {
            type: "create-request",
            level: "type",
            fhirVersion: context.request.fhirVersion,
            resource: context.request.resource,
            body: resource,
          } as FHIRRequest;

          await context.state.producer.send({
            topic: context.state.topic,
            messages: [
              {
                value: JSON.stringify(request),
              },
            ],
          });

          return {
            ...context,
            response: {
              type: "create-response",
              level: "type",
              fhirVersion: context.request.fhirVersion,
              resource: context.request.resource,
              body: resource,
            } as FHIRResponse,
          };
        }
        case "delete-request": {
          switch (context.request.level) {
            case "instance": {
              await context.state.producer.send({
                topic: context.state.topic,
                messages: [
                  {
                    value: JSON.stringify(context.request),
                  },
                ],
              });

              return {
                ...context,
                response: {
                  type: "delete-response",
                  level: "instance",
                  fhirVersion: context.request.fhirVersion,
                  id: context.request.id,
                } as FHIRResponse,
              };
            }

            case "type":
            case "system":
            default: {
              throw new OperationError(
                outcomeError(
                  "not-supported",
                  `Operation delete operation at level '${context.request.level}' not supported on kafka provider.`,
                ),
              );
            }
          }
        }
        case "batch-request":
        case "transaction-request":
        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Operation '${context.request.type}' not supported on kafka provider.`,
            ),
          );
        }
      }
    },
  ]);
}

export function createKafkaClient<CTX extends IGUHealthServerCTX>(config: {
  kafka: KafkaConfig;
  topic: string;
}): FHIRClient<CTX> {
  const kafka = new Kafka(config.kafka);
  const prod = kafka.producer();

  return new AsynchronousClient<KafkaState, CTX>(
    { client: kafka, producer: prod, topic: config.topic },
    createKafkaMiddleware(),
  );
}
