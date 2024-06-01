import { Command } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";

import createServer from "../server.js";
import createWorker from "../worker/index.js";

interface DBMigrate {
  up: () => Promise<void>;
}

let dbmigrate: DBMigrate;

async function runServer(port: number) {
  const server = await createServer();
  return server.listen(port);
}

type Services = {
  server?: Awaited<ReturnType<typeof runServer>>;
  worker?: Awaited<ReturnType<typeof createWorker>>;
};

let runningServices: Services = {};

function terminateServices(services: Services) {
  if (services.server) services.server.close();
  if (services.worker) services.worker();
}

export function runCommands(command: Command) {
  command
    .command("run")
    .description("Run either server, worker or migrate.")
    .argument("<type>", "Either 'server', 'worker' or 'migrate'")
    .option("-p, --port <number>", "port to run on.", "3000")
    .action(async (type, options) => {
      terminateServices(runningServices);
      switch (type) {
        case "server": {
          runningServices = {
            ...runningServices,
            server: await runServer(options.port),
          };
          break;
        }
        case "worker": {
          runningServices = {
            ...runningServices,
            worker: await createWorker(),
          };
          break;
        }
        case "both": {
          runningServices = {
            server: await runServer(options.port),
            worker: await createWorker(),
          };
          break;
        }
        case "migrate": {
          // @ts-ignore
          dbmigrate = DBMigrate.getInstance(true, {
            cmdOptions: {
              "sql-file": true,
              "migrations-dir":
                "src/fhir-storage/providers/postgres/migrations",
            },
          });
          await dbmigrate.up();
          break;
        }
        default:
          throw new Error("Invalid type");
      }
    });
}

process.on("SIGINT", function () {
  console.log("Exiting...");
  terminateServices(runningServices);
  process.exit();
});
