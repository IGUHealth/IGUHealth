import { Producer, Transaction } from "kafkajs";
import { nanoid } from "nanoid";

import { TenantId } from "@iguhealth/jwt";

import { IQueue, IQueueTransaction, Message } from "./interface.js";

export class KafkaTransaction implements IQueue, IQueueTransaction {
  private readonly _transaction: Transaction;
  private readonly _transactionKey: string;
  constructor(transaction: Transaction) {
    this._transaction = transaction;
    this._transactionKey = nanoid(24);
  }
  commit(): Promise<void> {
    return this._transaction.commit();
  }
  abort(): Promise<void> {
    return this._transaction.abort();
  }
  async send(
    tenant: TenantId,
    topic: string,
    messages: Message[],
  ): Promise<void> {
    await this._transaction.send({
      topic: topic,
      messages: messages.map((m) => ({
        ...m,
        key: this._transactionKey,
        headers: { tenant, ...m.headers },
        value: JSON.stringify(m.value),
      })),
    });
  }
  // Just return the transaction itself.
  // This is a no-op because we are already in a transaction.
  async transaction(): Promise<IQueueTransaction> {
    return this;
  }

  isTransaction(): boolean {
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

  async transaction() {
    const transaction = await this._producer.transaction();
    return new KafkaTransaction(transaction);
  }

  isTransaction(): boolean {
    return false;
  }
}
