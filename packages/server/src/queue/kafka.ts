import {
  CompressionTypes,
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

export class KafkaBatch implements IQueue, IQueueBatch {
  private readonly _producer: Producer;
  private readonly _transactionKey: string;
  private _messages: Record<string, KafkaMessage[]> = {};

  constructor(producer: Producer) {
    this._producer = producer;
    this._transactionKey = nanoid(24);
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
      messages.map((m) => ({
        ...m,
        key: this._transactionKey,
        value: JSON.stringify(m.value),
      })),
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
}

export class KafkaQueue implements IQueue {
  private readonly _producer: Producer;

  constructor(producer: Producer) {
    this._producer = producer;
  }

  async send<T extends ITopic>(
    topic: T,
    messages: ITopicMessage<T>[],
  ): Promise<void> {
    await this._producer.send({
      compression: CompressionTypes.GZIP,
      topic: topic,
      messages: messages.map((m) => ({
        ...m,
        value: JSON.stringify(m.value),
      })),
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
    return new KafkaBatch(this._producer);
  }

  isBatch(): boolean {
    return false;
  }
}
