import {
  Admin,
  CompressionTypes,
  Kafka,
  Message as KafkaMessage,
  Producer,
  TopicMessages,
} from "kafkajs";
import { nanoid } from "nanoid";

import { TenantId } from "@iguhealth/jwt";

import { IQueue, IQueueBatch } from "./interface.js";
import {
  ITopic,
  ITopicMessage,
  TenantTopic,
  TopicType,
} from "./topics/index.js";

/**
 * Check if a given topic exists in Kafka.
 * @param admin The admin client
 * @param topic Topic to check
 * @returns true|false if the topic exists
 */
async function doesKafkaTopicExist(admin: Admin, topic: ITopic) {
  // The admin client will throw an exception if any of the provided topics do not already exist.
  try {
    await admin.fetchTopicMetadata({ topics: [topic] });
    return true;
  } catch {
    return false;
  }
}

async function createTopic(admin: Admin, topic: ITopic): Promise<boolean> {
  await admin.connect();
  try {
    if (!(await doesKafkaTopicExist(admin, topic))) {
      const result = await admin.createTopics({ topics: [{ topic }] });
      return result;
    }
    return true;
  } finally {
    await admin.disconnect();
  }
}

export class KafkaBatch implements IQueue, IQueueBatch {
  private readonly _kafka: Kafka;
  private readonly _producer: Producer;
  private readonly _transactionKey: string;
  private _messages: Record<string, KafkaMessage[]> = {};

  constructor(_kafka: Kafka, producer: Producer) {
    this._kafka = _kafka;
    this._producer = producer;
    this._transactionKey = nanoid(24);
  }

  async createTopic<T extends ITopic>(topic: T): Promise<boolean> {
    return createTopic(this._kafka.admin(), topic);
  }

  async commit(): Promise<void> {
    const sendData: TopicMessages[] = Object.keys(this._messages).map(
      (topic) => {
        return {
          topic: topic,
          messages: this._messages[topic],
        };
      },
    );

    await this._producer.sendBatch({
      compression: CompressionTypes.GZIP,
      topicMessages: sendData,
    });
  }
  async abort(): Promise<void> {
    this._messages = {};
  }

  async send<T extends ITopic>(
    topic: T,
    messages: ITopicMessage<T>[],
  ): Promise<void> {
    this._messages[topic] = (this._messages[topic] ?? []).concat(
      messages.map((m) => {
        return {
          ...m,
          key: this._transactionKey,
          value: JSON.stringify(m.value),
        };
      }),
    );
  }

  async sendTenant<
    Tenant extends TenantId,
    Type extends TopicType,
    T extends TenantTopic<Tenant, Type>,
  >(tenant: Tenant, topic: T, messages: ITopicMessage<T>[]): Promise<void> {
    this.send(
      topic,
      messages.map((m) => ({ ...m, headers: { tenant, ...m.headers } })),
    );
  }
  // Just return the transaction itself.
  // This is a no-op because we are already in a transaction.
  async batch(): Promise<IQueueBatch> {
    return this;
  }

  isBatch(): boolean {
    return true;
  }

  disconnect() {
    return this._producer.disconnect();
  }
}

export class KafkaQueue implements IQueue {
  private readonly _kafka: Kafka;
  private readonly _producer: Producer;

  constructor(_kafka: Kafka, producer: Producer) {
    this._kafka = _kafka;
    this._producer = producer;
  }

  async createTopic<T extends ITopic>(topic: T): Promise<boolean> {
    const result = await createTopic(this._kafka.admin(), topic);

    return result;
  }

  async send<T extends ITopic>(
    topic: T,
    messages: ITopicMessage<T>[],
  ): Promise<void> {
    await this._producer.send({
      compression: CompressionTypes.GZIP,
      topic: topic,
      messages: messages.map((m) => {
        return {
          ...m,
          value: JSON.stringify(m.value),
        };
      }),
    });
  }

  async sendTenant<
    Tenant extends TenantId,
    Type extends TopicType,
    T extends TenantTopic<Tenant, Type>,
  >(tenant: Tenant, topic: T, messages: ITopicMessage<T>[]): Promise<void> {
    await this.send(
      topic,
      messages.map((m) => ({
        ...m,
        headers: { tenant, ...m.headers },
      })),
    );
  }

  async batch() {
    return new KafkaBatch(this._kafka, this._producer);
  }

  isBatch(): boolean {
    return false;
  }

  disconnect() {
    return this._producer.disconnect();
  }
}
