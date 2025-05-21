import getConfigProvider from "../../../config/index.js";
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
    const config = getConfigProvider();
    const store = await createStore(config);
    const iguhealthServices: IGUHealthServices = {
      config,
      environment: await config.get("IGUHEALTH_ENVIRONMENT"),
      queue: await createQueue(config),
      store,
      search: await createSearchStore(config),
      lock: new PostgresLock(store.getClient()),
      logger: await createLogger(config),
      terminologyProvider: new TerminologyProvider(),
      client: await createClient(config),
      resolveCanonical,
    };
    return iguhealthServices;
  };
