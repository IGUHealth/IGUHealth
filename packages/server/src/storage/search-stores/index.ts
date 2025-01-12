import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { createResourceStorePool } from "../pg.js";
import { SearchEngine } from "./interface.js";
import { PostgresSearchEngine } from "./postgres/index.js";

interface PostgresSearchEngineConfig {
  type: "postgres";
}

export type SearchEngineConfig = PostgresSearchEngineConfig;

export async function createSearchStore<CTX extends IGUHealthServerCTX>(
  config: SearchEngineConfig,
): Promise<SearchEngine<CTX>> {
  switch (config.type) {
    case "postgres": {
      return new PostgresSearchEngine(
        createResourceStorePool({
          user: process.env.SEARCH_STORE_PG_USERNAME,
          password: process.env.SEARCH_STORE_PG_PASSWORD,
          host: process.env.SEARCH_STORE_PG_HOST,
          database: process.env.SEARCH_STORE_PG_NAME,
          port: parseInt(process.env.SEARCH_STORE_PG_PORT ?? "5432"),
          ssl:
            process.env.SEARCH_STORE_PG_SSL === "true"
              ? {
                  // Self signed certificate CA is not used.
                  rejectUnauthorized: false,
                  host: process.env.SEARCH_STORE_PG_HOST,
                  port: parseInt(process.env.SEARCH_STORE_PG_PORT ?? "5432"),
                }
              : false,
        }),
      );
    }
    default: {
      throw new OperationError(
        outcomeFatal("exception", `Unknown store type: ${config.type}`),
      );
    }
  }
}
