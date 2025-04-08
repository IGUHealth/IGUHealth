import { Batch, Consumer, Kafka, KafkaMessage } from "kafkajs";

import { createKafkaClient } from "../../providers/index.js";
import { DYNAMIC_TOPIC } from "../../topics/dynamic-topic.js";
import {
  IConsumerGroupID,
  ITopic,
  ITopicPattern,
  OperationsTopic,
  TENANT_TOPIC_PATTERN,
} from "../../topics/index.js";
import { Message, MessageHandler } from "../types.js";

async function listTopics(kafka: Kafka, pattern: RegExp): Promise<ITopic[]> {
  return (await kafka.admin().listTopics()).filter((t) =>
    pattern.test(t),
  ) as ITopic[];
}

function kafkaMessageToMessage(
  topic_id: string,
  message: KafkaMessage,
): Message {
  return {
    topic_id,
    key: message.key?.toString() ?? undefined,
    headers: message.headers as Record<string, string>,
    value: JSON.parse(message.value?.toString("utf-8") ?? ""),
    offset: message.offset,
    created_at: message.timestamp,
  };
}

function batchToMessages(batch: Batch): Message[] {
  return batch.messages.map((message) =>
    kafkaMessageToMessage(batch.topic.toString(), message),
  );
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
    eachMessage: async ({ topic, message }) => {
      await messageHandler(undefined, {
        topic,
        messages: [kafkaMessageToMessage(topic, message)],
      });
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
    eachBatch: async ({ batch }) => {
      const message = batchToMessages(batch);
      await handler.eachMessage(ctx, {
        topic: batch.topic,
        messages: message,
      });
      console.log(
        `- ${prefix(batch.topic, batch.partition, batch.messages?.[0]?.offset, batch.messages?.[0]?.timestamp)} ${batch.messages.length} messages`,
      );
    },
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

type Handler<CTX> = { eachMessage: MessageHandler<CTX> };

async function createKafkaConsumer<CTX>(
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

export default async function createKafkaWorker<CTX>(
  groupId: IConsumerGroupID,
  ctx: CTX,
  handler: MessageHandler<CTX>,
): Promise<() => Promise<void>> {
  const stop = await createKafkaConsumer(
    ctx,
    TENANT_TOPIC_PATTERN(OperationsTopic),
    groupId,
    {
      eachMessage: async (ctx, { topic, messages: message }) => {
        await handler(ctx, { messages: message, topic });
      },
    },
  );

  return stop;
}
