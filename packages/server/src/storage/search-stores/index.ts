import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";
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
      return new PostgresSearchEngine();
    }
    default: {
      throw new OperationError(
        outcomeFatal("exception", `Unknown store type: ${config.type}`),
      );
    }
  }
}
