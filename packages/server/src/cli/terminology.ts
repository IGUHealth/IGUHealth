import { Command } from "commander";
import * as csv from "csv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db, { doNothing } from "zapatos/db";
import * as s from "zapatos/schema";

import { createPGPool } from "../fhir-storage/providers/postgres/pg.js";

async function createSystem(pg: db.Queryable, url: string) {
  return db
    .upsert(
      "terminology_systems",
      [{ url }],
      db.constraint("terminology_systems_pkey"),
      { updateColumns: doNothing },
    )
    .run(pg);
}

async function insertCodesDB(
  pg: db.Queryable,
  values: s.terminology_codes.Insertable[],
) {
  try {
    await db
      .upsert(
        "terminology_codes",
        values,
        db.constraint("terminology_codes_pkey"),
        { updateColumns: doNothing },
      )
      .run(pg);
  } catch (error) {
    console.error(error);
  }
}

function readCSV(filepath: string): csv.parser.Parser {
  const parser = fs
    .createReadStream(filepath)
    .pipe(csv.parse({ columns: true }));
  return parser;
}

async function loadTerminology(pg: db.Queryable, system: string) {
  const root = path.join(
    fileURLToPath(import.meta.url),
    "../../../external-codesystems",
  );
  switch (system) {
    case "iso-3166": {
      const system = "iso-3166";
      await createSystem(pg, system);
      const inserts: s.terminology_codes.Insertable[] = [];
      const csv = readCSV(path.join(root, "./iso-3166/iso-3166.csv"));

      for await (const record of csv) {
        inserts.push({
          code: record["alpha-3"],
          system: system,
        });
      }

      await insertCodesDB(pg, inserts);

      return;
    }

    case "iso-4217": {
      const system = "iso-4217";
      await createSystem(pg, system);
      const inserts: s.terminology_codes.Insertable[] = [];
      const csv = readCSV(path.join(root, "./iso-4217/iso-4217.csv"));

      for await (const record of csv) {
        // Work with each record
        inserts.push({
          code: record["Alphabetic Code"],
          system: system,
        });
      }

      await insertCodesDB(pg, inserts);

      return;
    }
  }
}

export function terminologyCommands(command: Command) {
  command
    .command("load")
    .description("Load external codesystems into DB")
    .requiredOption("-s, --system <system>", "System to load.")
    .action(async (options) => {
      const pg = createPGPool();
      await loadTerminology(pg, options.system);
    });
}
