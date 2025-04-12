import { Kafka, Partitioners } from "kafkajs";
import pg from "pg";

import { IQueue } from "./interface.js";
import { KafkaQueue } from "./kafka.js";
import { PGQueue } from "./pg.js";

export function createKafkaClient() {
  return new Kafka({
    brokers: process.env.KAFKA_QUEUE_BROKERS?.split(",") ?? [],
    clientId: process.env.KAFKA_QUEUE_CLIENT_ID,
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
      return new KafkaQueue(kafka, producer);
    }
    case "postgres": {
      const connection = new pg.Pool({
        user: process.env.QUEUE_DB_PG_USERNAME,
        password: process.env.QUEUE_DB_PG_PASSWORD,
        host: process.env.QUEUE_DB_PG_HOST,
        database: process.env.QUEUE_DB_PG_NAME,
        port: parseInt(process.env.QUEUE_DB_PG_PORT ?? "5432"),
        ssl:
          process.env.QUEUE_DB_PG_SSL === "true"
            ? {
                // Self signed certificate CA is not used.
                rejectUnauthorized: false,
                host: process.env.QUEUE_DB_PG_HOST,
                port: parseInt(process.env.QUEUE_DB_PG_PORT ?? "5432"),
              }
            : false,
      });
      return new PGQueue({ connection });
    }
    default: {
      throw new Error(`Invalid queue type '${process.env.QUEUE_TYPE}'`);
    }
  }
}
