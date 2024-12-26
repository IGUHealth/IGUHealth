import { Kafka, logLevel } from "kafkajs";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";

import { PostgresStore } from "../../fhir-storage/resource-stores/postgres.js";
import { staticWorkerServices } from "../utilities.js";
import { associateVersionIdFromKafkaMessage } from "./utilities.js";

export default async function createStorageWorker() {
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: ["localhost:9092"],
    clientId: "resource",
  });

  const workerId = "worker-1";
  const topic = "resources";
  const consumer = kafka.consumer({ groupId: "resource-storage" });

  const store = new PostgresStore();
  const services = staticWorkerServices(workerId);

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      if (message.value) {
        const value: s.resources.Insertable = JSON.parse(
          message.value.toString(),
        );

        await store.insert({ ...services, tenant: value.tenant as TenantId }, [
          associateVersionIdFromKafkaMessage(partition, message, value),
        ]);
      }

      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix} ${message.key}`);
    },
  });

  return async () => {
    await consumer.disconnect();
    process.exit(0);
  };
}
