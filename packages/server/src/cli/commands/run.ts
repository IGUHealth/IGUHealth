import { Command } from "commander";

import createServer from "../../server.js";
import createIndexingWorker from "../../worker/kafka/consumers/search-indexing.js";
import createStorageWorker from "../../worker/kafka/consumers/storage.js";
import createWorker from "../../worker/v1.js";

async function runServer(port: number) {
  const server = await createServer();
  return server.listen(port);
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
    workers: [await createWorker()],
  };
};

const storageWorker: Parameters<Command["action"]>[0] = async () => {
  runningServices = {
    workers: [...runningServices.workers, await createStorageWorker()],
  };
};

const searchIndexingWorker: Parameters<Command["action"]>[0] = async () => {
  runningServices = {
    workers: [...runningServices.workers, await createIndexingWorker()],
  };
};

const all: Parameters<Command["action"]>[0] = async (options) => {
  terminateServices();
  let workers: Array<() => Promise<void>> = await Promise.all([
    createStorageWorker(),
    createIndexingWorker(),
  ]);

  const server = await runServer(options.port);

  workers = workers.concat([await createWorker()]);

  runningServices = {
    server,
    workers,
  };
};

function kafkaCommands(command: Command) {
  command
    .command("storage")
    .description("Storage kafka worker.")
    .action(storageWorker);

  command
    .command("indexing")
    .description("Indexing kafka worker.")
    .action(searchIndexingWorker);
}

export function runCommands(command: Command) {
  kafkaCommands(command.command("kafka-worker"));

  command
    .command("server")
    .option("-p, --port <number>", "port to run on.", "3000")
    .description("Run the server.")
    .action(server);

  command.command("worker").description("Run a worker.").action(worker);

  command
    .command("both")
    .option("-p, --port <number>", "port to run on.", "3000")
    .description("Run the server. And start up background workers.")
    .action(all);
}
