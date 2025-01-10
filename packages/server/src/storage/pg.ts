import pg from "pg";
import * as db from "zapatos/db";

/**
 * Uses Environment variables to create PG Pool.
 * @returns pg.Pool
 */
export function createResourceStorePool(config: pg.PoolConfig): db.Queryable {
  const pool = new pg.Pool(config);

  return pool;
}
