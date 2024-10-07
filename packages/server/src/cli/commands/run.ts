import { Command } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";

// import { R4, R4B } from "@iguhealth/fhir-types/versions";
// import { TenantId } from "@iguhealth/jwt/types";

// import syncArtifacts from "../fhir-storage/providers/postgres/migrations/syncArtifacts.js";
import createServer from "../../server.js";
import createWorker from "../../worker/index.js";
import {
  generateSP1MetaInformationCode,
  generateSP1Sets,
} from "../generate/sp1-parameters.js";

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

const generateSP1TablesAndSets = async (
  version: FHIR_VERSION,
  output: string,
  parameterURLSet: Set<string>,
) => {
  mkdirSync(path.join(output, ".."), { recursive: true });

  const sp1ParameterCode = await generateSP1MetaInformationCode(
    version,
    parameterURLSet,
  );

  writeFileSync(output, sp1ParameterCode);
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

  const r4_set = await generateSP1Sets(R4);
  const r4b_set = await generateSP1Sets(R4B);

  await generateSP1TablesAndSets(
    R4,
    path.join(
      "src/fhir-storage/providers/postgres/generated/sp1-parameters/r4.sp1parameters.ts",
    ),
    r4_set,
  );
  await generateSP1TablesAndSets(
    R4B,
    path.join(
      "src/fhir-storage/providers/postgres/generated/sp1-parameters/r4b.sp1parameters.ts",
    ),
    r4b_set,
  );
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
