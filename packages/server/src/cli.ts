import { program } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";
import { exec } from "node:child_process";
import util from "node:util";
import * as generateSQL from "zapatos/generate";

import createServer from "./server.js";
import createWorker from "./worker/index.js";

const execPromise = util.promisify(exec);

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

async function run() {
  program
    .command("generate-types")
    .description(
      "Generate typescript types off of postgres schema and json schemas",
    )
    .action(async () => {
      await generateSQL.generate({
        db: {
          user: process.env.FHIR_DATABASE_USERNAME,
          password: process.env.FHIR_DATABASE_PASSWORD,
          host: process.env.FHIR_DATABASE_HOST,
          database: process.env.FHIR_DATABASE_NAME,
          port: parseInt(process.env.FHIR_DATABASE_PORT || "5432"),
          ssl:
            process.env.FHIR_DATABASE_SSL === "true"
              ? {
                  // Self signed certificate CA is not used.
                  rejectUnauthorized: false,
                  host: process.env.FHIR_DATABASE_HOST,
                  port: parseInt(process.env.FHIR_DATABASE_PORT || "5432"),
                }
              : false,
        },
        outDir: "src/fhir-storage/providers/postgres/generated",
      });
      const res = await execPromise(
        "yarn json2ts -i 'src/json-schemas/schemas/*.json' -o src/json-schemas/schemas",
      );
      if (res.stderr) {
        throw new Error(res.stderr);
      }
    });

  program
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

  await program.parseAsync();
}

process.on("SIGINT", function () {
  console.log("Exiting...");
  terminateServices(runningServices);
  process.exit();
});

run();
