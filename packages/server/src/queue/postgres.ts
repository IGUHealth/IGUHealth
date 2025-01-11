// import db, { Queryable } from "zapatos/db";

// import { TenantId } from "@iguhealth/jwt";

// import { Message, Queue } from "./interface.js";

// export class PostgresQueue implements Queue {
//   private readonly _client: Queryable;

//   constructor(db: Queryable) {
//     this._client = db;
//   }

//   async send(
//     tenant: TenantId,
//     topic_id: string,
//     messages: Omit<Message, "id" | "tenant" | "topic_id">[],
//   ): Promise<Message[]> {
//     const response = await db
//       .insert(
//         "sub_queue",
//         messages.map((m) => ({ ...m, tenant, topic_id })),
//       )
//       .run(this._client);

//     return response as Message[];
//   }
// }
