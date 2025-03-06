import child_process from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(child_process.exec);

async function checkServer() {
  const command =
    "yarn workspace @iguhealth/server cli migrate artifacts status";
  let pollTotal = process.argv[2] ?? 80;
  let pollNumber = 0;

  let status = 1;

  while (pollNumber < pollTotal && status === 1) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    try {
      const res = await exec(command);
      status = res.code;

      console.log(`res: '${res.code}'`);
    } catch (e) {
      console.error(e);
    } finally {
      pollNumber++;
    }
  }
  if (status === 1) {
    throw new Error("Failed to sync artifacts");
  }
}

checkServer();
