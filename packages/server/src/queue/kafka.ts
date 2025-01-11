import { Message as KafkaMessage, Producer, TopicMessages } from "kafkajs";
import { nanoid } from "nanoid";

import { TenantId } from "@iguhealth/jwt";

import { IQueue, IQueueTransaction, Message } from "./interface.js";

export class KafkaBatch implements IQueue, IQueueTransaction {
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

    await this._producer.sendBatch({ topicMessages: sendData });
  }
  async abort(): Promise<void> {
    this._messages = {};
  }
  async send(
    tenant: TenantId,
    topic: string,
    messages: Message[],
  ): Promise<void> {
    this._messages[topic] = (this._messages[topic] ?? []).concat(
      messages.map((m) => ({
        ...m,
        key: this._transactionKey,
        headers: { tenant, ...m.headers },
        value: JSON.stringify(m.value),
      })),
    );
  }
  // Just return the transaction itself.
  // This is a no-op because we are already in a transaction.
  async batch(): Promise<IQueueTransaction> {
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

  async send(
    tenant: TenantId,
    topic: string,
    messages: Message[],
  ): Promise<void> {
    await this._producer.send({
      topic: topic,
      messages: messages.map((m) => ({
        ...m,
        headers: { tenant, ...m.headers },
        value: JSON.stringify(m.value),
      })),
    });
  }

  async batch() {
    return new KafkaBatch(this._producer);
  }

  isBatch(): boolean {
    return false;
  }
}
