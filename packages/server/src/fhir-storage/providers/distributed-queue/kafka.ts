import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClient, FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRResponse } from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import { generateId } from "../../utilities/generateId.js";
import { Kafka, KafkaConfig, Producer } from "kafkajs";

// const producer = kafka.producer();

type KafkaState = { client: InstanceType<typeof Kafka>; producer: Producer };

function createKafkaMiddleware<
  State extends KafkaState,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      switch (context.request.type) {
        case "delete-request": {
        }
        case "create-request": {
        }
        case "update-request": {
        }
        case "patch-request": {
        }
        case "batch-request": {
        }
        case "transaction-request": {
        }
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

export async function createKafkaClient<CTX extends IGUHealthServerCTX>(
  kafkaConfig: KafkaConfig,
): Promise<FHIRClient<CTX>> {
  const kafka = new Kafka(kafkaConfig);
  const prod = await kafka.producer();

  return new AsynchronousClient<KafkaState, CTX>(
    { client: kafka, producer: prod },
    createKafkaMiddleware(),
  );
}
