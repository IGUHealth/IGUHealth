import { Consumer, Kafka } from "kafkajs";

import { createKafkaClient } from "../../queue/provider/index.js";
import { DYNAMIC_TOPIC } from "../../queue/topics/dynamic-topic.js";
import {
  IConsumerGroupID,
  ITopic,
  ITopicPattern,
} from "../../queue/topics/index.js";
import { Handler, MessageHandler } from "./types.js";

async function listTopics(kafka: Kafka, pattern: RegExp): Promise<ITopic[]> {
  return (await kafka.admin().listTopics()).filter((t) =>
    pattern.test(t),
  ) as ITopic[];
}

async function dynamicTopicsSubscriber(
  kafka: Kafka,
  groupId: IConsumerGroupID,
  dynamicTopic: ITopic,
  messageHandler: MessageHandler<unknown>,
) {
  const dynamicConsumer = kafka.consumer({ groupId });
  await dynamicConsumer.subscribe({ topic: dynamicTopic });
  await dynamicConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await messageHandler(undefined, { topic, partition, message });
    },
  });

  return async () => {
    await dynamicConsumer.stop();
    await dynamicConsumer.disconnect();
  };
}

function prefix(
  topic: string,
  partition: number,
  offset: string,
  timestamp: string,
) {
  return `${topic}[${partition} | ${offset}] / ${timestamp}`;
}

async function startConsumer<CTX>(
  consumer: Consumer,
  ctx: CTX,
  topic: ITopic[],
  handler: Handler<CTX>,
): Promise<() => Promise<void>> {
  // For no topics just ignore.
  if (topic.length === 0)
    return async () => {
      console.log("Do nothing");
    };

  await consumer.connect();
  await consumer.subscribe({
    topics: topic,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage:
      "eachMessage" in handler
        ? async ({ topic, partition, message }) => {
            await handler.eachMessage(ctx, { topic, partition, message });
            console.log(
              `- ${prefix(topic, partition, message.offset, message.timestamp)} ${message.key}`,
            );
          }
        : undefined,
    eachBatch:
      "eachBatch" in handler
        ? async ({ batch }) => {
            await handler.eachBatch(ctx, { batch });
            console.log(
              `- ${prefix(batch.topic, batch.partition, batch.messages?.[0]?.offset, batch.messages?.[0]?.timestamp)} ${batch.messages.length} messages`,
            );
          }
        : undefined,
  });

  const stop = async () => {
    await consumer.stop();
    await consumer.disconnect();
  };

  return stop;
}

function dynamicConsumerGroupID(
  consumerGroupId: IConsumerGroupID,
): IConsumerGroupID {
  return ("dynamic_" + consumerGroupId) as IConsumerGroupID;
}

async function handlePattern<CTX>(
  kafka: Kafka,
  consumer: Consumer,
  topic: ITopicPattern,
  ctx: CTX,
  consumerGroupId: IConsumerGroupID,
  handler: Handler<CTX>,
) {
  const topics = await listTopics(kafka, topic);
  let stop = await startConsumer(consumer, ctx, topics, handler);
  const stopDynamicConsumer = await dynamicTopicsSubscriber(
    kafka,
    dynamicConsumerGroupID(consumerGroupId),
    DYNAMIC_TOPIC,
    async () => {
      await stop();
      const topics = await listTopics(kafka, topic);
      stop = await startConsumer(consumer, ctx, topics, handler);
    },
  );

  return async () => {
    await stopDynamicConsumer();
    await stop();
  };
}

export default async function createKafkaConsumer<CTX>(
  ctx: CTX,
  topic: ITopic | ITopicPattern,
  consumerGroupId: IConsumerGroupID,
  handler: Handler<CTX>,
): Promise<() => Promise<void>> {
  const kafka = createKafkaClient();

  const consumer = kafka.consumer({ groupId: consumerGroupId });

  if (topic instanceof RegExp) {
    return handlePattern(kafka, consumer, topic, ctx, consumerGroupId, handler);
  } else {
    return startConsumer(consumer, ctx, [topic], handler);
  }
}
