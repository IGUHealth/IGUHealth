import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { IGUHealthServerCTX } from "../../fhir-api/types.js";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import {
  R4BSystemSearchRequest,
  R4BTypeSearchRequest,
  R4SystemSearchRequest,
  R4TypeSearchRequest,
} from "@iguhealth/client/types";

export type FHIRSearchRequest =
  | R4SystemSearchRequest
  | R4TypeSearchRequest
  | R4BSystemSearchRequest
  | R4BTypeSearchRequest;

export type SearchResult = { version_id: id; id: id; type: AllResourceTypes };

export interface SearchEngine {
  search<CTX extends IGUHealthServerCTX>(
    ctx: CTX,
    fhirRequest: FHIRSearchRequest,
  ): Promise<{
    total?: number;
    result: SearchResult[];
  }>;

  index<Version extends FHIR_VERSION, CTX extends IGUHealthServerCTX>(
    ctx: CTX,
    fhirVersion: Version,
    resource: Resource<Version, AllResourceTypes>,
  ): Promise<void>;

  removeIndex<Version extends FHIR_VERSION, CTX extends IGUHealthServerCTX>(
    ctx: CTX,
    fhirVersion: Version,
    resource: Resource<Version, AllResourceTypes>,
  ): Promise<void>;
}
