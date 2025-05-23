import { Command } from "commander";

import getConfigProvider from "../../config/index.js";
import { ConfigProvider } from "../../config/provider/interface.js";
import { IGUHealthServices } from "../../fhir-server/types.js";
import { pushFromStoreWorker } from "../../queue/from-store/index.js";
import indexingHandler from "../../queue/implementations/consumers/handlers/search-indexing.js";
import storageHandler from "../../queue/implementations/consumers/handlers/storage.js";
import subscriptionHandler from "../../queue/implementations/consumers/handlers/subscription-v1/index.js";
import createWorker from "../../queue/implementations/consumers/implementations/index.js";
import { createConsumerServices } from "../../queue/implementations/consumers/services.js";
import { MessageHandler } from "../../queue/implementations/consumers/types.js";
import {
  Consumers,
  IConsumerGroupID,
  OperationsTopic,
  TENANT_TOPIC_PATTERN,
} from "../../queue/implementations/topics/index.js";
import createServer from "../../server.js";

async function runServer(port: number) {
  const server = await createServer();
  return server.listen(port);
}

async function runWorker(
  config: ConfigProvider,
  groupId: IConsumerGroupID,
  handler: MessageHandler<IGUHealthServices>,
) {
  return createWorker(
    TENANT_TOPIC_PATTERN(OperationsTopic),
    groupId,
    await config.get("QUEUE_TYPE"),
    await createConsumerServices(),
    handler,
  );
}

type Services = {
  server?: Awaited<ReturnType<typeof runServer>>;
  workers: Awaited<ReturnType<typeof createWorker>>[];
};

let runningServices: Services = { workers: [] };

export function terminateServices() {
  if (runningServices.server) runningServices.server.close();
  if (runningServices.workers) {
    runningServices.workers.forEach((w) => w());
    runningServices.workers = [];
  }
}

const config = getConfigProvider();

const server: Parameters<Command["action"]>[0] = async (options) => {
  terminateServices();
  runningServices = {
    ...runningServices,
    server: await runServer(options.port),
  };
};

const worker: Parameters<Command["action"]>[0] = async () => {
  terminateServices();

  runningServices = {
    ...runningServices,
    workers: [
      await runWorker(config, Consumers.SubscriptionV1, subscriptionHandler),
    ],
  };
};

const storageWorker: Parameters<Command["action"]>[0] = async () => {
  runningServices = {
    workers: [
      ...runningServices.workers,
      await runWorker(config, Consumers.Storage, storageHandler),
    ],
  };
};

const searchIndexingWorker: Parameters<Command["action"]>[0] = async () => {
  runningServices = {
    workers: [
      ...runningServices.workers,
      await runWorker(config, Consumers.SearchIndexing, indexingHandler),
    ],
  };
};

const moveToQueueWorker: Parameters<Command["action"]>[0] = async () => {
  const services = await createConsumerServices();
  runningServices = {
    ...runningServices,
    workers: [...runningServices.workers, await pushFromStoreWorker(services)],
  };
};

const all: Parameters<Command["action"]>[0] = async (options) => {
  terminateServices();

  const [server, ...workers] = await Promise.all([
    runServer(options.port),
    // runWorker(Consumers.Storage, storageHandler),
    // runWorker(Consumers.SearchIndexing, indexingHandler),
    runWorker(config, Consumers.SubscriptionV1, subscriptionHandler),
    await pushFromStoreWorker(await createConsumerServices()),
  ]);

  runningServices = {
    server,
    workers,
  };
};

function workers(command: Command) {
  command
    .command("storage")
    .description("Storage kafka worker.")
    .action(storageWorker);

  command
    .command("indexing")
    .description("Indexing kafka worker.")
    .action(searchIndexingWorker);

  command
    .command("subscription")
    .description("Subscription kafka worker.")
    .action(worker);

  command
    .command("push-from-store")
    .description("Push from store")
    .action(moveToQueueWorker);
}

export function runCommands(command: Command) {
  workers(command.command("worker"));

  command
    .command("server")
    .option("-p, --port <number>", "port to run on.", "3000")
    .description("Run the server.")
    .action(server);

  command
    .command("all")
    .option("-p, --port <number>", "port to run on.", "3000")
    .description("Run the server. And start up background workers.")
    .action(all);
}
