import {
  R4BHistoryInstanceRequest,
  R4BSystemHistoryRequest,
  R4BTypeHistoryRequest,
  R4HistoryInstanceRequest,
  R4SystemHistoryRequest,
  R4TypeHistoryRequest,
} from "@iguhealth/client/lib/types";
import {
  FHIR_VERSION,
  Resource,
  AllResourceTypes,
} from "@iguhealth/fhir-types/versions";
import { resources } from "zapatos/schema";
import { ResourceStore } from "./interface.js";
import { Kafka, Producer } from "kafkajs";

// Create the client with the broker list
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka1:9092", "kafka2:9092"],
});

const producer = kafka.producer();

/**
 * KafkaStore is a ResourceStore that uses Kafka as a backend for insertions.
 * It wraps a resourcestore for performing operations like read and history.
 */
class KafkaStore<CTX> implements ResourceStore<CTX> {
  private _store: ResourceStore<CTX>;
  private _producer: Producer;
  constructor(store: ResourceStore<CTX>, producer: Producer) {
    this._store = store;
    this._producer = producer;
  }
  read<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    version_ids: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    return this._store.read(ctx, fhirVersion, version_ids);
  }
  async insert<Version extends FHIR_VERSION>(
    ctx: CTX,
    data: resources.Insertable[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    throw new Error();
    // const response = await producer.send({
    //   topic: "resource",
    //   messages: data.map((d) => ({ value: JSON.stringify(d) })),
    // });

    // response[0].
  }
  history<Version extends FHIR_VERSION>(
    ctx: CTX,
    request:
      | R4BHistoryInstanceRequest
      | R4BSystemHistoryRequest
      | R4BTypeHistoryRequest
      | R4HistoryInstanceRequest
      | R4SystemHistoryRequest
      | R4TypeHistoryRequest,
  ): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>> {
    return this._store.history(ctx, request);
  }
}
