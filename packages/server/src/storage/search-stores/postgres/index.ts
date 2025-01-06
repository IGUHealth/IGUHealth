import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import { FHIRSearchRequest, SearchEngine, SearchResult } from "../interface.js";
import indexResource, { removeIndices } from "./indexing.js";
import { executeSearchQuery } from "./search.js";

export class PostgresSearchEngine<CTX extends IGUHealthServerCTX>
  implements SearchEngine<CTX>
{
  async search(
    ctx: CTX,
    request: FHIRSearchRequest,
  ): Promise<{ total?: number; result: SearchResult[] }> {
    const result = await executeSearchQuery(ctx, request);
    return result;
  }
  index<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    resource: Resource<Version, AllResourceTypes>,
  ): Promise<void> {
    return indexResource(ctx, fhirVersion, resource);
  }
  removeIndex<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    id: id,
    resourceType: ResourceType<Version>,
  ): Promise<void> {
    return removeIndices(ctx, fhirVersion, id, resourceType);
  }
}
