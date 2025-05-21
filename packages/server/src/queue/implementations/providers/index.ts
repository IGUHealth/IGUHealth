import { Kafka, Partitioners } from "kafkajs";
import pg from "pg";

import { ConfigProvider } from "../../../config/provider/interface.js";
import { IQueue } from "./interface.js";
import { KafkaQueue } from "./kafka.js";
import { PGQueue } from "./pg.js";

export async function createKafkaClient(config: ConfigProvider) {
  return new Kafka({
    brokers: (await config.get("KAFKA_QUEUE_BROKERS"))?.split(",") ?? [],
    clientId: await config.get("KAFKA_QUEUE_CLIENT_ID"),
  });
}

export default async function createQueue(
  config: ConfigProvider,
): Promise<IQueue> {
  switch (await config.get("QUEUE_TYPE")) {
    case "kafka": {
      const kafka = await createKafkaClient(config);
      const producer = kafka.producer({
        allowAutoTopicCreation: true,
        createPartitioner: Partitioners.DefaultPartitioner,
      });
      await producer.connect();
      return new KafkaQueue(kafka, producer);
    }
    case "postgres": {
      const connection = new pg.Pool({
        user: await config.get("QUEUE_DB_PG_USERNAME"),
        password: await config.get("QUEUE_DB_PG_PASSWORD"),
        host: await config.get("QUEUE_DB_PG_HOST"),
        database: await config.get("QUEUE_DB_PG_NAME"),
        port: parseInt((await config.get("QUEUE_DB_PG_PORT")) ?? "5432"),
        ssl:
          (await config.get("QUEUE_DB_PG_SSL")) === "true"
            ? {
                // Self signed certificate CA is not used.
                rejectUnauthorized: false,
                host: await config.get("QUEUE_DB_PG_HOST"),
                port: parseInt(
                  (await config.get("QUEUE_DB_PG_PORT")) ?? "5432",
                ),
              }
            : false,
      });
      return new PGQueue({ connection });
    }
    default: {
      throw new Error(`Invalid queue type '${config.get("QUEUE_TYPE")}'`);
    }
  }
}
