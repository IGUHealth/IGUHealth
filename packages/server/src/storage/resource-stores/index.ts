import { Kafka, KafkaConfig } from "kafkajs";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";
import { ResourceStore } from "./interface.js";
// import { KafkaWrapperStore } from "./kafka.js";
import { PostgresStore } from "./postgres/index.js";

interface KafkaStoreConfig {
  kafka?: KafkaConfig;
}

interface PostgresStoreConfig extends KafkaStoreConfig {
  type: "postgres";
}

export type Storeconfig = PostgresStoreConfig;

async function _createInternalStore<
  CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">,
>(config: Storeconfig): Promise<ResourceStore<CTX>> {
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
>(config: Storeconfig): Promise<ResourceStore<CTX>> {
  const internalStore = await _createInternalStore(config);

  // const kafkaConfig = config.kafka;
  // // Wrap with kafka if kafkaConfig is provided
  // if (kafkaConfig !== undefined) {
  //   const kafka = new Kafka(kafkaConfig);
  //   const producer = kafka.producer();
  //   await producer.connect();
  //   return new KafkaWrapperStore(internalStore, producer);
  // }

  return internalStore;
}
