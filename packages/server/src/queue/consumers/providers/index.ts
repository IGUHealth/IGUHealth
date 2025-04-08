import { createClient, createLogger } from "../../../fhir-server/index.js";
import resolveCanonical from "../../../fhir-server/resolvers/resolveCanonical.js";
import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../fhir-terminology/index.js";
import createResourceStore from "../../../resource-stores/index.js";
import { createSearchStore } from "../../../search-stores/index.js";
import createQueue from "../../providers/index.js";
import { IConsumerGroupID } from "../../topics/index.js";
import { MessageHandler } from "../types.js";
import createKafkaWorker from "./kafka-local.js";

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
  groupId: IConsumerGroupID,
  type: typeof process.env.QUEUE_TYPE,
  ctx: CTX,
  handler: MessageHandler<CTX>,
) {
  switch (type) {
    case "kafka": {
      return createKafkaWorker(groupId, ctx, handler);
    }
    case "postgres": {
      throw new Error("Not implemented");
    }
  }
}
