// import {
//   R4BHistoryInstanceRequest,
//   R4BSystemHistoryRequest,
//   R4BTypeHistoryRequest,
//   R4HistoryInstanceRequest,
//   R4SystemHistoryRequest,
//   R4TypeHistoryRequest,
// } from "@iguhealth/client/lib/types";
// import {
//   FHIR_VERSION,
//   Resource,
//   AllResourceTypes,
// } from "@iguhealth/fhir-types/versions";
// import { resources } from "zapatos/schema";
// import { ResourceStore } from "./interface.js";
// import { Kafka, Partitioners, Producer } from "kafkajs";

// // Create the client with the broker list
// const kafka = new Kafka({
//   brokers: ["localhost:9092"],
// });

// const producer = kafka.producer({
//   allowAutoTopicCreation: true,
//   createPartitioner: Partitioners.DefaultPartitioner,
// });

// await producer.connect();

// /**
//  * KafkaStore is a ResourceStore that uses Kafka as a backend for insertions.
//  * It wraps a resourcestore for performing operations like read and history.
//  */
// export class KafkaStore<CTX> implements ResourceStore<CTX> {
//   private readonly _store: ResourceStore<CTX>;
//   private readonly _producer: Producer;
//   constructor(store: ResourceStore<CTX>) {
//     this._store = store;
//     this._producer = producer;
//   }
//   read<Version extends FHIR_VERSION>(
//     ctx: CTX,
//     fhirVersion: Version,
//     version_ids: string[],
//   ): Promise<Resource<Version, AllResourceTypes>[]> {
//     return this._store.read(ctx, fhirVersion, version_ids);
//   }
//   async insert<Version extends FHIR_VERSION>(
//     ctx: CTX,
//     data: resources.Insertable[],
//   ): Promise<Resource<Version, AllResourceTypes>[]> {
//     console.log("AYO");
//     const response = await producer.send({
//       topic: "resources",
//       messages: data.map((d) => ({ value: JSON.stringify(d) })),
//     });

//     console.log(response);

//     return data.map(
//       (d) => d.resource as unknown as Resource<Version, AllResourceTypes>,
//     );
//   }
//   history<Version extends FHIR_VERSION>(
//     ctx: CTX,
//     request:
//       | R4BHistoryInstanceRequest
//       | R4BSystemHistoryRequest
//       | R4BTypeHistoryRequest
//       | R4HistoryInstanceRequest
//       | R4SystemHistoryRequest
//       | R4TypeHistoryRequest,
//   ): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>> {
//     return this._store.history(ctx, request);
//   }
// }
