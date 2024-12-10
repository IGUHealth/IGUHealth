import {
  FHIR_VERSION,
  Resource,
  AllResourceTypes,
} from "@iguhealth/fhir-types/versions";
import * as s from "zapatos/schema";
import * as db from "zapatos/db";

import { ResourceStore } from "./interface.js";

class PostgresStore implements ResourceStore {
  private readonly _pg: db.Queryable;
  constructor(pg: db.Queryable) {
    this._pg = pg;
  }
  read<Version extends FHIR_VERSION>(
    fhirVersion: Version,
    version_ids: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    throw new Error("Method not implemented.");
  }
  insert<Version extends FHIR_VERSION>(
    data: s.resources.Insertable,
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    throw new Error("Method not implemented.");
  }
  delete<Version extends FHIR_VERSION>(
    fhirVersion: Version,
    id: string[],
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
