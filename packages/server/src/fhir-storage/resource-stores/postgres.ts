import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { toDBFHIRVersion } from "../utilities/version.js";
import { ResourceStore } from "./interface.js";

export class PostgresStore implements ResourceStore {
  private readonly _pg: db.Queryable;
  constructor(pg: db.Queryable) {
    this._pg = pg;
  }
  async read<Version extends FHIR_VERSION>(
    tenant: TenantId,
    fhirVersion: Version,
    version_ids: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]> {
    if (version_ids.length === 0) return [];
    const fhir_version = toDBFHIRVersion(fhirVersion);
    const whereable = db.conditions.or(
      ...version_ids.map((v): s.resources.Whereable | db.SQLFragment => ({
        version_id: parseInt(v),
        tenant,
        fhir_version,
      })),
    );

    const res = (
      await db
        .select("resources", whereable, { columns: ["resource"] })
        .run(this._pg)
    ).map((r) => r.resource) as unknown as Resource<
      Version,
      AllResourceTypes
    >[];

    const version_ids_to_index = version_ids.reduce(
      (acc: Record<string, number>, id, index) => {
        acc[id] = index;
        return acc;
      },
      {},
    );

    const returnOrdered = [...new Array(version_ids.length)];

    res.forEach((resource) => {
      const versionId = resource.meta?.versionId;
      if (!versionId)
        throw new OperationError(
          outcomeError(
            "exception",
            "postgres store could not derive versionId from resource meta.",
          ),
        );
      const index = version_ids_to_index[versionId];
      returnOrdered[index] = resource;
    });

    return returnOrdered;
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
