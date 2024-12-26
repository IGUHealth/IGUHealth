import { Kafka, KafkaConfig } from "kafkajs";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";
import { ResourceStore } from "./interface.js";
import { KafkaWrapperStore } from "./kafka.js";
import { PostgresStore } from "./postgres.js";

async function _createInternalStore<
  CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">,
>(config: Record<string, string>): Promise<ResourceStore<CTX>> {
  switch (config.type) {
    case "postgres": {
      return new PostgresStore();
    }
    default: {
      throw new OperationError(
        outcomeFatal("exception", `Unknown store type: ${config.type}`),
      );
    }
  }
}

export default async function createResourceStore<
  CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">,
>(
  config: Record<string, string>,
  kafkaConfig: KafkaConfig | undefined,
): Promise<ResourceStore<CTX>> {
  const internalStore = await _createInternalStore(config);

  // Wrap with kafka if kafkaConfig is provided
  if (kafkaConfig) {
    const kafka = new Kafka(kafkaConfig);
    const producer = kafka.producer();
    await producer.connect();
    return new KafkaWrapperStore(internalStore, producer);
  }

  return internalStore;
}
