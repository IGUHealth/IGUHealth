// Locking mechanisms

import { Client, ClientConfig } from "pg";
import { Lock } from "./interfaces";

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
  return client.query(`SELECT pg_advisory_xact_lock($1)`, [id]);
}

export default class PostgresLock implements Lock<PostgresLock> {
  private config: ClientConfig;
  constructor(config: ClientConfig) {
    this.config = config;
  }

  async withLock(lockId: string, body: (v: PostgresLock) => Promise<void>) {
    const id = hash(lockId);
    const client = new Client(this.config);
    await client.connect();
    await client.query("BEGIN");
    const lock = await pgLock(client, id);
    const res = await client.query("select * from pg_locks");
    try {
      await body(this);
    } finally {
      //await pgUnlock(this.client, lockId);
      await client.query("END");
      await client.end();
    }
  }
}
