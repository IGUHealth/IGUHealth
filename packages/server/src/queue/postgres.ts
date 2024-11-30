import db, { Queryable } from "zapatos/db";

import { TenantId } from "@iguhealth/jwt";

import { Message, Queue } from "./interface.js";

export class PostgresQueue implements Queue {
  private readonly _client: Queryable;

  constructor(db: Queryable) {
    this._client = db;
  }

  async send(
    tenant: TenantId,
    messages: Omit<Message, "id" | "tenant">[],
  ): Promise<Message[]> {
    const response = await db
      .insert(
        "sub_queue",
        messages.map((m) => ({ ...m, tenant })),
      )
      .run(this._client);

    return response as Message[];
  }
}
