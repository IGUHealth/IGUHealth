// Locking mechanisms

import { Client } from "pg";

interface Lock {
  transact(lockId: string, body: () => Promise<void>): Promise<void>;
}

function hash(str: string): number {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    // Max charcode length is 5 so leftshift over by 5
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

function pgLock(client: Client, id: number) {
  return client.query(`SELECT pg_try_advisory_xact_lock($1)`, [id]);
}

function pgUnlock(client: Client, id: number) {
  return client.query(`SELECT pg_advisory_xact_unlock($1)`, [id]);
}

export class PostgresLock implements Lock {
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  async transact(lockId: string, body: () => Promise<void>) {
    const id = hash(lockId);
    await this.client.query("BEGIN");
    console.log("Transacting");
    const lock = await pgLock(this.client, id);
    const res = await this.client.query("select * from pg_locks");
    console.log(
      "LOCKED",
      id,
      res.rows,
      lock.rows[0],
      // @ts-ignore
      lock.rows[0]["pg_advisory_xact_lock"]
    );
    try {
      await body();
    } finally {
      //await pgUnlock(this.client, lockId);
      await this.client.query("END");
      console.log("[LOCK RELEASED]");
    }
  }
}
