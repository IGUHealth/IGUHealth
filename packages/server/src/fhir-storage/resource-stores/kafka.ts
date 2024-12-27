import { Producer } from "kafkajs";
import { resources } from "zapatos/schema";

import {
  R4BHistoryInstanceRequest,
  R4BSystemHistoryRequest,
  R4BTypeHistoryRequest,
  R4HistoryInstanceRequest,
  R4SystemHistoryRequest,
  R4TypeHistoryRequest,
} from "@iguhealth/client/lib/types";
import { id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";

import { ResourceStore } from "./interface.js";

/**
 * KafkaStore is a ResourceStore that uses Kafka as a backend for insertions.
 * It wraps a resourcestore for performing operations like read and history.
 */
export class KafkaWrapperStore<CTX> implements ResourceStore<CTX> {
  private readonly _store: ResourceStore<CTX>;
  private readonly _producer: Producer;
  constructor(store: ResourceStore<CTX>, producer: Producer) {
    this._store = store;
    this._producer = producer;
  }
  readLatestResourceById<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    id: id,
  ): Promise<Resource<Version, AllResourceTypes> | undefined> {
    return this._store.readLatestResourceById(ctx, fhirVersion, id);
  }
  read<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    version_ids: id[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    return this._store.read(ctx, fhirVersion, version_ids);
  }
  async insert<Version extends FHIR_VERSION>(
    ctx: CTX,
    data: resources.Insertable[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    await this._producer.send({
      topic: "resources",
      messages: data.map((d) => ({ value: JSON.stringify(d) })),
    });

    return data.map(
      (d) => d.resource as unknown as Resource<Version, AllResourceTypes>,
    );
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
