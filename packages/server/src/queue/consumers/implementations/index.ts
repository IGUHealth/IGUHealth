import pg from "pg";

import { createClient, createLogger } from "../../../fhir-server/index.js";
import resolveCanonical from "../../../fhir-server/resolvers/resolveCanonical.js";
import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../fhir-terminology/index.js";
import createResourceStore from "../../../resource-stores/index.js";
import { createSearchStore } from "../../../search-stores/index.js";
import createQueue from "../../providers/index.js";
import { IConsumerGroupID, ITopic, ITopicPattern } from "../../topics/index.js";
import { MessageHandler } from "../types.js";
import createKafkaWorker from "./kafka-local.js";
import createPGWorker from "./postgres/index.js";

export const services: () => Promise<
  Omit<IGUHealthServerCTX, "user" | "tenant">
> = async () => {
  const iguhealthServices: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    queue: await createQueue(),
    store: await createResourceStore({ type: "postgres" }),
    search: await createSearchStore({ type: "postgres" }),
    logger: createLogger(),
    terminologyProvider: new TerminologyProvider(),
    client: createClient(),
    resolveCanonical,
  };
  return iguhealthServices;
};

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
