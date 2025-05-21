import pg from "pg";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { ConfigProvider } from "../config/provider/interface.js";
import { IGUHealthServerCTX } from "../fhir-server/types.js";
import { SearchEngine } from "./interface.js";
import { PostgresSearchEngine } from "./postgres/index.js";

interface PostgresSearchEngineConfig {
  type: "postgres";
}

export type SearchEngineConfig = PostgresSearchEngineConfig;

export async function createSearchStore<CTX extends IGUHealthServerCTX>(
  config: ConfigProvider,
): Promise<SearchEngine<CTX>> {
  const type = await config.get("SEARCH_STORE_TYPE");
  switch (type) {
    case "postgres": {
      return new PostgresSearchEngine(
        new pg.Pool({
          user: await config.get("SEARCH_STORE_PG_USERNAME"),
          password: await config.get("SEARCH_STORE_PG_PASSWORD"),
          host: await config.get("SEARCH_STORE_PG_HOST"),
          database: await config.get("SEARCH_STORE_PG_NAME"),
          port: parseInt((await config.get("SEARCH_STORE_PG_PORT")) ?? "5432"),
          ssl:
            (await config.get("SEARCH_STORE_PG_SSL")) === "true"
              ? {
                  // Self signed certificate CA is not used.
                  rejectUnauthorized: false,
                  host: await config.get("SEARCH_STORE_PG_HOST"),
                  port: parseInt(
                    (await config.get("SEARCH_STORE_PG_PORT")) ?? "5432",
                  ),
                }
              : false,
        }),
      );
    }
    default: {
      throw new OperationError(
        outcomeFatal("exception", `Unknown store type: ${type}`),
      );
    }
  }
}
