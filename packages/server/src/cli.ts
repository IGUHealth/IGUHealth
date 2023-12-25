import { program } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";
import * as generateSQL from "zapatos/generate";

import createWorker from "./worker/index.js";
import createServer from "./server.js";

interface DBMigrate {
  up: () => Promise<void>;
}

let dbmigrate: DBMigrate;

async function runServer(port: number) {
  const server = await createServer();
  return server.listen(3000);
}

async function run() {
  program
    .command("generate-pg-types")
    .description("Generate typescript types off of postgres schema")
    .action(async () => {
      await generateSQL.generate({
        db: {
          user: process.env["FHIR_DATABASE_USERNAME"],
          password: process.env["FHIR_DATABASE_PASSWORD"],
          host: process.env["FHIR_DATABASE_HOST"],
          database: process.env["FHIR_DATABASE_NAME"],
          port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
          ssl:
            process.env["FHIR_DATABASE_SSL"] === "true"
              ? {
                  // Self signed certificate CA is not used.
                  rejectUnauthorized: false,
                  host: process.env["FHIR_DATABASE_HOST"],
                  port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
                }
              : false,
        },
        outDir: "src/resourceProviders/postgres/generated",
      });
    });

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
