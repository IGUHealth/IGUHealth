import {
  FHIR_VERSION,
  Resource,
  AllResourceTypes,
} from "@iguhealth/fhir-types/versions";
import * as s from "zapatos/schema";
import * as db from "zapatos/db";

import { ResourceStore } from "./interface.js";

export class PostgresStore implements ResourceStore {
  private readonly _pg: db.Queryable;
  constructor(pg: db.Queryable) {
    this._pg = pg;
  }
  async read<Version extends FHIR_VERSION>(
    fhirVersion: Version,
    version_ids: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    const whereable = db.conditions.or(
      ...version_ids.map((v): s.resources.Whereable | db.SQLFragment => ({
        version_id: parseInt(v),
      })),
    );

    const res = await db
      .select("resources", whereable, { columns: ["resource"] })
      .run(this._pg);

    return res.map((r) => r.resource) as unknown as Resource<
      Version,
      AllResourceTypes
    >[];
  }
  async insert<Version extends FHIR_VERSION>(
    data: s.resources.Insertable[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    const result = await db
      .insert("resources", data, { returning: ["resource"] })
      .run(this._pg);

    return result.map((r) => r.resource) as unknown as Resource<
      Version,
      AllResourceTypes
    >[];
  }
}
