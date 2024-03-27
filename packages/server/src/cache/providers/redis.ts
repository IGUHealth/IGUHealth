import Redis from "ioredis";

import { TenantId } from "@iguhealth/jwt";

import { IOCache } from "../interface.js";

function constructKey(tenant: TenantId, key: string) {
  return `${tenant}/${key}`;
}

export default class RedisCache<CTX extends { tenant: TenantId }>
  implements IOCache<CTX>
{
  private _client: Redis.default;
  constructor(client: Redis.Redis) {
    this._client = client;
  }
  async get(ctx: CTX, key: string) {
    const value = await this._client.get(constructKey(ctx.tenant, key));
    return value;
  }
  async set(ctx: CTX, key: string, value: string | number) {
    if (typeof value !== "string" && typeof value !== "number") {
      throw new Error(
        `Saving to redis cache must be of type 'string' or 'number' not ${typeof value}`,
      );
    }
    await this._client.set(constructKey(ctx.tenant, key), value);
    return;
  }
}
