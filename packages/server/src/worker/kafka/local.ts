import { Consumer, Kafka } from "kafkajs";
import { MessageHandler } from "./types.js";
import {
  ConsumerGroupID,
  Topic,
  TopicPattern,
} from "../../queue/topics/index.js";
import { DYNAMIC_TOPIC } from "../../queue/topics/dynamic-topic.js";
import { createKafkaClient } from "../../queue/index.js";

async function listTopics(kafka: Kafka, pattern: RegExp): Promise<Topic[]> {
  return (await kafka.admin().listTopics()).filter((t) =>
    pattern.test(t),
  ) as Topic[];
}

async function dynamicTopicsSubscriber(
  kafka: Kafka,
  groupId: ConsumerGroupID,
  dynamicTopic: Topic,
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

async function startConsumer<CTX>(
  consumer: Consumer,
  ctx: CTX,
  topic: Topic[],
  handler: MessageHandler<CTX>,
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
    eachMessage: async ({ topic, partition, message }) => {
      try {
        await handler(ctx, { topic, partition, message });
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}`);
      } catch (e) {
        console.error(e);
      }
    },
  });

  const stop = async () => {
    await consumer.stop();
    await consumer.disconnect();
  };

  return stop;
}

async function handlePattern<CTX>(
  kafka: Kafka,
  consumer: Consumer,
  topic: TopicPattern,
  ctx: CTX,
  consumerGroupId: ConsumerGroupID,
  handler: MessageHandler<CTX>,
) {
  const topics = await listTopics(kafka, topic);
  let stop = await startConsumer(consumer, ctx, topics, handler);
  const stopDynamicConsumer = await dynamicTopicsSubscriber(
    kafka,
    ("dynamic_" + consumerGroupId) as ConsumerGroupID,
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
  topic: Topic | TopicPattern,
  consumerGroupId: ConsumerGroupID,
  handler: MessageHandler<CTX>,
): Promise<() => Promise<void>> {
  const kafka = createKafkaClient();

  const consumer = kafka.consumer({ groupId: consumerGroupId });

  if (topic instanceof RegExp) {
    return handlePattern(kafka, consumer, topic, ctx, consumerGroupId, handler);
  } else {
    return startConsumer(consumer, ctx, [topic], handler);
  }
}
