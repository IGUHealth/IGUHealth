import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";
import { createResourceStorePool } from "../pg.js";
import { PostgresStore } from "./postgres/index.js";

interface PostgresStoreConfig {
  type: "postgres";
}

export type Storeconfig = PostgresStoreConfig;

export default async function createResourceStore<
  CTX extends Pick<IGUHealthServerCTX, "tenant">,
>(config: Storeconfig): Promise<PostgresStore<CTX>> {
  switch (config.type) {
    case "postgres": {
      return new PostgresStore(
        createResourceStorePool({
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
