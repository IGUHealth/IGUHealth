import Redis from "ioredis";
import type { RedisOptions } from "ioredis";
import { IOCache } from "./interface";

function constructKey(workspace: string, key: string) {
  return `${workspace}/${key}`;
}

export default class RedisCache<CTX extends { workspace: string }>
  implements IOCache<CTX>
{
  private _client: Redis;
  constructor(config: RedisOptions) {
    this._client = new Redis(config);
  }
  async get(ctx: CTX, key: string) {
    const value = await this._client.get(constructKey(ctx.workspace, key));
    return value;
  }
  async set(ctx: CTX, key: string, value: string | number) {
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(
        `Saving to redis cache must be of type 'string' or 'number' not ${typeof value}`
      );
    }
    await this._client.set(constructKey(ctx.workspace, key), value);
    return;
  }
}
