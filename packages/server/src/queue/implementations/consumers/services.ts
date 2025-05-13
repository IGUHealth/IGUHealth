import { createClient, createLogger } from "../../../fhir-server/index.js";
import resolveCanonical from "../../../fhir-server/resolvers/resolveCanonical.js";
import { IGUHealthServices } from "../../../fhir-server/types.js";
import { TerminologyProvider } from "../../../fhir-terminology/index.js";
import { createSearchStore } from "../../../search-stores/index.js";
import createStore from "../../../storage/index.js";
import PostgresLock from "../../../synchronization/postgres.lock.js";
import createQueue from "../providers/index.js";

export const createConsumerServices: () => Promise<IGUHealthServices> =
  async () => {
    const store = await createStore({ type: "postgres" });
    const iguhealthServices: IGUHealthServices = {
      environment: process.env.IGUHEALTH_ENVIRONMENT,
      queue: await createQueue(),
      store,
      search: await createSearchStore({ type: "postgres" }),
      lock: new PostgresLock(store.getClient()),
      logger: createLogger(),
      terminologyProvider: new TerminologyProvider(),
      client: createClient(),
      resolveCanonical,
    };
    return iguhealthServices;
  };
