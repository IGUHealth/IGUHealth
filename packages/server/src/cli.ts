import { program } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";
import createWorker from "./worker/index.js";
import createServer from "./server.js";

let dbmigrate: any;

async function runServer(port: number) {
  const server = await createServer();
  return server.listen(3000);
}

async function run() {
  program
    .command("run")
    .description("Run either server, worker or migrate.")
    .argument("<type>", "Either 'server', 'worker' or 'migrate'")
    .option("-p, --port <number>", "port to run on.", "3000")
    .action(async (type, options) => {
      switch (type) {
        case "server": {
          const listener = await runServer(options.port);
          break;
        }
        case "worker": {
          const stopWorker = await createWorker();
          break;
        }
        case "both": {
          const listener = await runServer(options.port);
          const stopWorker = await createWorker();
          break;
        }
        case "migrate": {
          // @ts-ignore
          dbmigrate = DBMigrate.getInstance(true, {
            cmdOptions: {
              "sql-file": true,
              "migrations-dir": "src/resourceProviders/postgres/migrations",
            },
          });
          await dbmigrate.up();
          break;
        }
        default:
          throw new Error("Invalid type");
      }
    });

  await program.parseAsync();
}

run();
