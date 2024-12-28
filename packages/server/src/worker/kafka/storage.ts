import { Kafka, logLevel } from "kafkajs";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";

import createResourceStore from "../../fhir-storage/resource-stores/index.js";
import { staticWorkerServices } from "../utilities.js";

export default async function createStorageWorker() {
  const kafka = new Kafka({
    logLevel: logLevel.INFO,
    brokers: process.env.KAFKA_BROKERS?.split(",") ?? [],
    clientId: process.env.KAFKA_CLIENT_ID,
  });

  const workerId = "worker-1";
  const topic = "resources";
  const consumer = kafka.consumer({ groupId: "resource-storage" });

  const store = await createResourceStore({ type: "postgres" });
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
          value,
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
