import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";

import {
  ITopic,
  ITopicMessage,
  TenantTopic,
  TopicType,
} from "../topics/index.js";
import { IQueue, IQueueBatch } from "./interface.js";

export type PGQueueConfig = {
  connection: db.Queryable;
};

export class PGQueueBatch implements IQueue, IQueueBatch {
  private readonly _connection: db.Queryable;

  private _messages: Record<string, s.sub_queue.Insertable[]> = {};

  constructor(config: PGQueueConfig) {
    this._connection = config.connection;
  }
  async commit(): Promise<void> {
    const messages = Object.values(this._messages).flat();
    await db
      .insert(
        "sub_queue",
        messages.map((m) => ({
          ...m,
          headers: JSON.stringify(m.headers ?? {}),
          value: JSON.stringify(m.value),
        })),
      )
      .run(this._connection);
  }
  async abort(): Promise<void> {
    this._messages = {};
  }
  sendTenant<
    Tenant extends TenantId,
    Type extends TopicType,
    T extends TenantTopic<Tenant, Type>,
  >(tenant: Tenant, topic: T, messages: ITopicMessage<T>[]): Promise<void> {
    return this.send(
      topic,
      messages.map((m) => ({ ...m, headers: { tenant, ...m.headers } })),
    );
  }
  async batch(): Promise<IQueueBatch> {
    return this;
  }
  isBatch(): boolean {
    return true;
  }
  async disconnect(): Promise<void> {
    return;
  }
  async createTopic<T extends ITopic>(_topic: T): Promise<boolean> {
    // No need as can dynamically be created on insert.
    return true;
  }
  async send<T extends ITopic>(
    topic_id: T,
    messages: ITopicMessage<T>[],
  ): Promise<void> {
    this._messages[topic_id] = [
      ...(this._messages[topic_id] || []),
      ...messages.map((m) => ({
        ...m,
        headers: m.headers as db.JSONValue,
        value: m.value as db.JSONValue,
        topic_id,
      })),
    ];
  }
}

export class PGQueue implements IQueue {
  private readonly _connection: db.Queryable;
  constructor(config: PGQueueConfig) {
    this._connection = config.connection;
  }

  async createTopic<T extends ITopic>(_topic: T): Promise<boolean> {
    // No need as can dynamically be created on insert.
    return true;
  }
  async send<T extends ITopic>(
    topic_id: T,
    messages: ITopicMessage<T>[],
  ): Promise<void> {
    await db
      .insert(
        "sub_queue",
        messages.map((m) => ({
          ...m,
          headers: JSON.stringify(m.headers ?? {}),
          value: JSON.stringify(m.value),
          topic_id,
        })),
      )
      .run(this._connection);
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
  batch(): Promise<IQueueBatch> {
    return db.transaction(
      this._connection,
      db.IsolationLevel.RepeatableRead,
      async (txt) => {
        return new PGQueueBatch({ connection: txt });
      },
    );
  }
  isBatch(): boolean {
    return false;
  }
  async disconnect(): Promise<void> {}
}
