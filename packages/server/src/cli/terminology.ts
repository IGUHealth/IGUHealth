import { Command } from "commander";
import * as csv from "csv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db, { doNothing } from "zapatos/db";
import * as s from "zapatos/schema";

import { createPGPool } from "../fhir-storage/providers/postgres/pg.js";

async function loadTerminology(pg: db.Queryable, system: string) {
  const root = path.join(
    fileURLToPath(import.meta.url),
    "../../../external-codesystems",
  );
  switch (system) {
    case "iso-3166": {
      const system = "iso-3166";
      await db
        .upsert(
          "terminology_systems",
          [{ url: system }],
          db.constraint("terminology_systems_pkey"),
          { updateColumns: doNothing },
        )
        .run(pg);
      const inserts: s.terminology_codes.Insertable[] = [];
      const parser = fs
        .createReadStream(path.join(root, "./iso-3166/iso-3166.csv"))
        .pipe(csv.parse({ columns: true }));

      for await (const record of parser) {
        inserts.push({
          code: record["alpha-3"],
          system: system,
        });
      }

      try {
        await db
          .upsert(
            "terminology_codes",
            inserts,
            db.constraint("terminology_codes_pkey"),
            { updateColumns: doNothing },
          )
          .run(pg);
      } catch (error) {
        console.error(error);
      }

      return;
    }

    case "iso-4217": {
      const system = "iso-4217";
      await db
        .upsert(
          "terminology_systems",
          [{ url: system }],
          db.constraint("terminology_systems_pkey"),
          { updateColumns: doNothing },
        )
        .run(pg);

      const inserts: s.terminology_codes.Insertable[] = [];
      const parser = fs
        .createReadStream(path.join(root, "./iso-4217/iso-4217.csv"))
        .pipe(csv.parse({ columns: true }));
      for await (const record of parser) {
        // Work with each record
        inserts.push({
          code: record["Alphabetic Code"],
          system: system,
        });
      }

      try {
        await db
          .upsert(
            "terminology_codes",
            inserts,
            db.constraint("terminology_codes_pkey"),
            { updateColumns: doNothing },
          )
          .run(pg);
      } catch (error) {
        console.error(error);
      }

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
