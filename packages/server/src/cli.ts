import { program } from "commander";
import createWorker from "./worker/index.js";
import createServer from "./server.js";

async function runServer(port: number) {
  const server = await createServer();
  return server.listen(3000);
}

async function run() {
  program
    .command("run")
    .description("Run either the server or a worker.")
    .argument("<type>", "Either 'server' or 'worker'")
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
        default:
          throw new Error("Invalid type");
      }
    });

  await program.parseAsync();
}

run();
