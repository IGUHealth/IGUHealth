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

export class PGQueue implements IQueue {
  constructor(config: unknown) {}

  async createTopic<T extends ITopic>(topic: T): Promise<boolean> {
    // No need as can dynamically be created on insert.
    return true;
  }
  send<T extends ITopic>(
    topic_id: T,
    messages: ITopicMessage<T>[],
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendTenant<
    Tenant extends TenantId,
    Type extends TopicType,
    T extends TenantTopic<Tenant, Type>,
  >(tenant: Tenant, topic: T, messages: ITopicMessage<T>[]): Promise<void> {
    throw new Error("Method not implemented.");
  }
  batch(): Promise<IQueueBatch> {
    throw new Error("Method not implemented.");
  }
  isBatch(): boolean {
    throw new Error("Method not implemented.");
  }
  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
