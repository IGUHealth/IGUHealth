import { Command } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";

import createServer from "../../server.js";
import createWorker from "../../worker/v1.js";

interface DBMigrate {
  up: () => Promise<void>;
}

async function runServer(port: number) {
  const server = await createServer();
  return server.listen(port);
}

type Services = {
  server?: Awaited<ReturnType<typeof runServer>>;
  worker?: Awaited<ReturnType<typeof createWorker>>;
};

let runningServices: Services = {};

export function terminateServices() {
  if (runningServices.server) runningServices.server.close();
  if (runningServices.worker) runningServices.worker();
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
    worker: await createWorker(),
  };
};

const both: Parameters<Command["action"]>[0] = async (options) => {
  terminateServices();
  runningServices = {
    server: await runServer(options.port),
    worker: await createWorker(),
  };
};

const migrate: Parameters<Command["action"]>[0] = async () => {
  const dbmigrate: DBMigrate = DBMigrate.getInstance(true, {
    cmdOptions: {
      "sql-file": true,
      "migrations-dir":
        "src/fhir-storage/providers/postgres/migrations/db-migrate",
    },
  });

  await dbmigrate.up();
};

export function runCommands(command: Command) {
  command
    .command("server")
    .option("-p, --port <number>", "port to run on.", "3000")
    .description("Run the server.")
    .action(server);
  command.command("worker").description("Run a worker.").action(worker);
  command
    .command("both")
    .option("-p, --port <number>", "port to run on.", "3000")
    .description("Run the server. And start up background worker.")
    .action(both);
  command.command("migrate").description("Run SQL migrations.").action(migrate);
}
