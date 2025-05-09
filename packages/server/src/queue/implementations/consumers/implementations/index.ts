import pg from "pg";

import { IConsumerGroupID, ITopic, ITopicPattern } from "../../topics/index.js";
import { MessageHandler } from "../types.js";
import createKafkaWorker from "./kafka-local.js";
import createPGWorker from "./postgres/index.js";

export default function createWorker<CTX>(
  topic: ITopicPattern | ITopic,
  groupId: IConsumerGroupID,
  type: typeof process.env.QUEUE_TYPE,
  ctx: CTX,
  handler: MessageHandler<CTX>,
) {
  switch (type) {
    case "kafka": {
      return createKafkaWorker(topic, groupId, ctx, handler);
    }
    case "postgres": {
      return createPGWorker(
        new pg.Pool({
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
        }),
        topic,
        groupId,
        ctx,
        handler,
      );
    }
  }
}
