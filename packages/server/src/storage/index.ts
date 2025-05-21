import pg from "pg";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { ConfigProvider } from "../config/provider/interface.js";
import { IGUHealthServerCTX } from "../fhir-server/types.js";
import { PostgresStore } from "./postgres/index.js";

interface PostgresStoreConfig {
  type: "postgres";
}

export type Storeconfig = PostgresStoreConfig;

export default async function createStore<CTX extends IGUHealthServerCTX>(
  config: ConfigProvider,
): Promise<PostgresStore<CTX>> {
  switch (await config.get("RESOURCE_STORE_TYPE")) {
    case "postgres": {
      return new PostgresStore(
        new pg.Pool({
          user: await config.get("RESOURCE_STORE_PG_USERNAME"),
          password: await config.get("RESOURCE_STORE_PG_PASSWORD"),
          host: await config.get("RESOURCE_STORE_PG_HOST"),
          database: await config.get("RESOURCE_STORE_PG_NAME"),
          port: parseInt(
            (await config.get("RESOURCE_STORE_PG_PORT")) ?? "5432",
          ),
          ssl:
            (await config.get("RESOURCE_STORE_PG_SSL")) === "true"
              ? {
                  // Self signed certificate CA is not used.
                  rejectUnauthorized: false,
                  host: await config.get("RESOURCE_STORE_PG_HOST"),
                  port: parseInt(
                    (await config.get("RESOURCE_STORE_PG_PORT")) ?? "5432",
                  ),
                }
              : false,
        }),
      );
    }
    default: {
      throw new OperationError(
        outcomeFatal(
          "exception",
          `Unknown store type: ${config.get("RESOURCE_STORE_TYPE")}`,
        ),
      );
    }
  }
}
