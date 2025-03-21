import * as db from "zapatos/db";

import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import { FHIRSearchRequest, SearchEngine, SearchResult } from "../interface.js";
import indexResource, { removeIndices } from "./indexing.js";
import { executeSearchQuery } from "./search.js";

export class PostgresSearchEngine<CTX extends IGUHealthServerCTX>
  implements SearchEngine<CTX>
{
  private readonly _pgClient;
  constructor(pgClient: db.Queryable) {
    this._pgClient = pgClient;
  }
  async search(
    ctx: CTX,
    request: FHIRSearchRequest,
  ): Promise<{ total?: number; result: SearchResult[] }> {
    try {
      const result = await executeSearchQuery(this._pgClient, ctx, request);
      return result;
    } catch (e) {
      if (e instanceof OperationError) {
        console.error(JSON.stringify(e.operationOutcome));
      }
      throw e;
    }
  }
  index<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    resource: Resource<Version, AllResourceTypes>,
  ): Promise<void> {
    return db.transaction(
      this._pgClient,
      db.IsolationLevel.ReadCommitted,
      async (txClient) => {
        return indexResource(txClient, ctx, fhirVersion, resource);
      },
    );
  }
  removeIndex<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    id: id,
    resourceType: ResourceType<Version>,
  ): Promise<void> {
    return db.transaction(
      this._pgClient,
      db.IsolationLevel.ReadCommitted,
      async (txClient) => {
        return removeIndices(txClient, ctx, fhirVersion, id, resourceType);
      },
    );
  }
}
