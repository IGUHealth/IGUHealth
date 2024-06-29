import { Kafka } from "kafkajs";

import { FHIRRequest } from "@iguhealth/client/types";
import { OperationOutcome } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4, Resource } from "@iguhealth/fhir-types/versions";
import { IguhealthMessagePost } from "@iguhealth/generated-ops/r4";
import {
  OperationError,
  outcomeError,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import InlineOperation from "./interface.js";

interface ChannelInformation {
  broker: Resource<R4, "MessageBroker">;
  topic: Resource<R4, "MessageTopic">;
}

function bundleToBrokerTopics(
  resources: (Resource<R4, "MessageTopic"> | Resource<R4, "MessageBroker">)[],
): ChannelInformation {
  const broker = resources.find(
    (resource) => resource.resourceType === "MessageBroker",
  ) as Resource<R4, "MessageBroker">;
  const topic = resources.find(
    (resource) => resource.resourceType === "MessageTopic",
  ) as Resource<R4, "MessageTopic">;

  if (!broker || !topic) {
    throw new OperationError(
      outcomeError("invalid", "Broker and/or topic not found"),
    );
  }

  return {
    broker,
    topic,
  };
}

async function postMessageBroker(
  channel: ChannelInformation,
  input: IguhealthMessagePost.Input,
): Promise<OperationOutcome> {
  switch (channel.broker.type) {
    case "kafka": {
      const kafka = new Kafka({
        brokers: [channel.broker.host],
      });
      const producer = kafka.producer();

      await producer.connect();
      await producer.send({
        topic: channel.topic.topicId,
        messages: [{ value: JSON.stringify(input) }],
      });
      await producer.disconnect();

      return outcomeInfo("value", "Message sent");
    }
    default: {
      throw new OperationError(outcomeError("invalid", "Invalid broker type"));
    }
  }
}

const IguhealthMessagePostInvoke = InlineOperation(
  IguhealthMessagePost.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    switch (request.level) {
      case "instance": {
        switch (request.resourceType) {
          case "MessageTopic": {
            const topicAndBroker = await ctx.client.search_type(
              ctx,
              request.fhirVersion,
              "MessageTopic",
              [
                {
                  name: "_id",
                  value: [request.id],
                },
                {
                  name: "_include",
                  value: ["MessageTopic:broker"],
                },
              ],
            );
            const channel = bundleToBrokerTopics(topicAndBroker.resources);

            const operationoutcome = await postMessageBroker(channel, input);
            return operationoutcome;
          }
          default: {
            throw new OperationError(
              outcomeError("invalid", "Invalid resource type"),
            );
          }
        }
      }
      default:
        throw new OperationError(outcomeError("invalid", "Invalid level"));
    }
  },
);

export default IguhealthMessagePostInvoke;
