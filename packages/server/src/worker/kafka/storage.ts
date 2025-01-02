import { Kafka, logLevel } from "kafkajs";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";

import createResourceStore from "../../fhir-storage/resource-stores/index.js";
import { staticWorkerServices } from "../utilities.js";
import { ERROR_QUEUE, RESOURCE_QUEUE } from "./constants.js";

export default async function createStorageWorker() {
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: process.env.KAFKA_BROKERS?.split(",") ?? [],
    clientId: process.env.KAFKA_CLIENT_ID,
  });

  const workerId = "worker-1";
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "resource-storage" });

  const store = await createResourceStore({ type: "postgres" });
  const services = staticWorkerServices(workerId);

  await consumer.connect();
  await consumer.subscribe({ topic: RESOURCE_QUEUE, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (message.value) {
          const value: s.resources.Insertable = JSON.parse(
            message.value.toString(),
          );

          await store.insert(
            { ...services, tenant: value.tenant as TenantId },
            [value],
          );
        }
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}`);
      } catch (e) {
        console.error(e);
        producer.send({ topic: ERROR_QUEUE, messages: [message] });
      }
    },
  });

  return async () => {
    await consumer.disconnect();
    process.exit(0);
  };
}
