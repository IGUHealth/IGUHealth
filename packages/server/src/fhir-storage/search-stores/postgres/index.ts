import {
  FHIR_VERSION,
  Resource,
  AllResourceTypes,
} from "@iguhealth/fhir-types/versions";
import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import { FHIRSearchRequest, SearchEngine, SearchResult } from "../interface.js";
import { executeSearchQuery } from "./search.js";
import indexResource, { removeIndices } from "./indexing.js";

export class PostgresSearchEngine<CTX extends IGUHealthServerCTX>
  implements SearchEngine<CTX>
{
  async search<CTX extends IGUHealthServerCTX>(
    ctx: CTX,
    request: FHIRSearchRequest,
  ): Promise<{ total?: number; result: SearchResult[] }> {
    const result = await executeSearchQuery(ctx, request);
    return result;
  }
  index<Version extends FHIR_VERSION, CTX extends IGUHealthServerCTX>(
    ctx: CTX,
    fhirVersion: Version,
    resource: Resource<Version, AllResourceTypes>,
  ): Promise<void> {
    return indexResource(ctx, fhirVersion, resource);
  }
  removeIndex<Version extends FHIR_VERSION, CTX extends IGUHealthServerCTX>(
    ctx: CTX,
    fhirVersion: Version,
    resource: Resource<Version, AllResourceTypes>,
  ): Promise<void> {
    return removeIndices(ctx, fhirVersion, resource);
  }
}
