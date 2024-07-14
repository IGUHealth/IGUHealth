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

async function insertEdgesDB(
  pg: db.Queryable,
  values: s.terminology_edge.Insertable[],
) {
  try {
    await db
      .upsert(
        "terminology_edge",
        values,
        db.constraint("terminology_edge_pkey"),
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
  console.log(`Loading terminology '${system}'`);
  const root = path.join(
    fileURLToPath(import.meta.url),
    "../../../external-codesystems",
  );
  switch (system) {
    // Country codes
    case "iso-3166": {
      const system = "urn:iso:std:iso:3166";
      await createSystem(pg, system);
      const inserts: s.terminology_codes.Insertable[] = [];
      const csv = readCSV(path.join(root, "./iso-3166/iso-3166.csv"));

      for await (const record of csv) {
        inserts.push({
          code: record["alpha-3"],
          display: record["name"],
          system: system,
        });
      }

      await insertCodesDB(pg, inserts);

      return;
    }
    // Currency codes
    case "iso-4217": {
      const system = "urn:iso:std:iso:4217";
      await createSystem(pg, system);
      const inserts: s.terminology_codes.Insertable[] = [];
      const csv = readCSV(path.join(root, "./iso-4217/iso-4217.csv"));

      for await (const record of csv) {
        // Work with each record
        inserts.push({
          code: record["Alphabetic Code"],
          display: record["Currency"],
          system: system,
        });
      }

      await insertCodesDB(pg, inserts);

      return;
    }

    // Media type codes
    case "bcp-13": {
      const system = "urn:ietf:bcp:13";
      await createSystem(pg, system);

      const loadMediaType = async (type: string) => {
        // Split the media codes across files by type.

        // Load application types.
        const csv = readCSV(path.join(root, "./media-types", `${type}.csv`));
        const codes: s.terminology_codes.Insertable[] = [
          { code: type, system, display: type },
        ];
        const edges: s.terminology_edge.Insertable[] = [];
        for await (const record of csv) {
          // Work with each record
          codes.push({
            code: record["Template"],
            display: record["Name"],
            system: system,
          });
          edges.push({
            system,
            parent_code: type,
            child_code: record["Template"],
          });
        }
        await insertCodesDB(pg, codes);
        await insertEdgesDB(pg, edges);
      };

      const mediaTypes = [
        "application",
        "audio",
        "font",
        "haptics",
        "image",
        "message",
        "model",
        "multipart",
        "text",
        "video",
      ];

      await Promise.all(mediaTypes.map(loadMediaType));
    }
  }
}

export function terminologyCommands(command: Command) {
  command
    .command("load")
    .description("Load external codesystems into DB")
    .requiredOption("-s, --system <system...>", "System to load.")
    .action(async (options) => {
      const pg = createPGPool();
      await Promise.all(
        options.system.map(async (system: string) => {
          await loadTerminology(pg, system);
        }),
      );
    });
}
