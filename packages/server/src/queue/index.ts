import { Kafka, Partitioners } from "kafkajs";

import { IQueue } from "./interface.js";
import { KafkaQueue } from "./kafka.js";

export function createKafkaClient() {
  return new Kafka({
    brokers: process.env.QUEUE_BROKERS?.split(",") ?? [],
    clientId: process.env.QUEUE_CLIENT_ID,
  });
}

export default async function createQueue(): Promise<IQueue> {
  switch (process.env.QUEUE_TYPE) {
    case "kafka": {
      const kafka = createKafkaClient();
      const producer = kafka.producer({
        allowAutoTopicCreation: true,
        createPartitioner: Partitioners.DefaultPartitioner,
      });
      await producer.connect();
      return new KafkaQueue(producer);
    }
    default: {
      throw new Error(`Invalid queue type '${process.env.QUEUE_TYPE}'`);
    }
  }
}
