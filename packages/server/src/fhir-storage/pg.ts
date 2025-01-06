import pg from "pg";

/**
 * Uses Environment variables to create PG Pool.
 * @returns pg.Pool
 */
export function createPGPool(): pg.Pool {
  const pool = new pg.Pool({
    user: process.env.RESOURCE_STORE_PG_USERNAME,
    password: process.env.RESOURCE_STORE_PG_PASSWORD,
    host: process.env.RESOURCE_STORE_PG_HOST,
    database: process.env.RESOURCE_STORE_PG_NAME,
    port: parseInt(process.env.RESOURCE_STORE_PG_PORT ?? "5432"),
    ssl:
      process.env.RESOURCE_STORE_PG_SSL === "true"
        ? {
            // Self signed certificate CA is not used.
            rejectUnauthorized: false,
            host: process.env.RESOURCE_STORE_PG_HOST,
            port: parseInt(process.env.RESOURCE_STORE_PG_PORT ?? "5432"),
          }
        : false,
  });

  return pool;
}
