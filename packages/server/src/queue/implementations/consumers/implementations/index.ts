import pg from "pg";

import { IGUHealthServices } from "../../../../fhir-server/types.js";
import type { ConfigSchema } from "../../../../json-schemas/schemas/config.schema.js";
import { IConsumerGroupID, ITopic, ITopicPattern } from "../../topics/index.js";
import { MessageHandler } from "../types.js";
import createKafkaWorker from "./kafka-local.js";
import createPGWorker from "./postgres/index.js";

export default function createWorker<CTX extends IGUHealthServices>(
  topic: ITopicPattern | ITopic,
  groupId: IConsumerGroupID,
  type: ConfigSchema["QUEUE_TYPE"],
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
          user: ctx.config.get("QUEUE_DB_PG_USERNAME"),
          password: ctx.config.get("QUEUE_DB_PG_PASSWORD"),
          host: ctx.config.get("QUEUE_DB_PG_HOST"),
          database: ctx.config.get("QUEUE_DB_PG_NAME"),
          port: parseInt(ctx.config.get("QUEUE_DB_PG_PORT") ?? "5432"),
          ssl:
            ctx.config.get("QUEUE_DB_PG_SSL") === "true"
              ? {
                  // Self signed certificate CA is not used.
                  rejectUnauthorized: false,
                  host: ctx.config.get("QUEUE_DB_PG_HOST"),
                  port: parseInt(ctx.config.get("QUEUE_DB_PG_PORT") ?? "5432"),
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
