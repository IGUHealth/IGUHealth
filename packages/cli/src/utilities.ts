import { Command } from "commander";
import fs from "node:fs";

type MutationOptions = { file?: string; data?: string };

export namespace dataCommand {
  export function readData(option: MutationOptions): unknown {
    if (option.file) {
      return JSON.parse(fs.readFileSync(option.file, "utf-8"));
    }

    if (option.data) {
      return JSON.parse(option.data);
    }
    throw new Error("No resource provided");
  }

  export function command(command: Command) {
    command
      .option("-f, --file <file>", "File for resource")
      .option("-d, --data <data>", "Data for resource");
    return command;
  }
}
