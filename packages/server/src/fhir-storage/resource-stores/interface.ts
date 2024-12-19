import * as s from "zapatos/schema";
import {
  R4BHistoryInstanceRequest,
  R4BSystemHistoryRequest,
  R4BTypeHistoryRequest,
  R4HistoryInstanceRequest,
  R4SystemHistoryRequest,
  R4TypeHistoryRequest,
} from "@iguhealth/client/types";
import { id } from "@iguhealth/fhir-types/r4/types";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";

export interface ResourceStore<CTX> {
  read<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    version_ids: id[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;

  readLatestResourceById<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    id: id,
  ): Promise<Resource<Version, AllResourceTypes> | undefined>;

  insert<Version extends FHIR_VERSION>(
    ctx: CTX,
    data: s.resources.Insertable[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;

  history<Version extends FHIR_VERSION>(
    ctx: CTX,
    request:
      | R4BHistoryInstanceRequest
      | R4BSystemHistoryRequest
      | R4BTypeHistoryRequest
      | R4HistoryInstanceRequest
      | R4SystemHistoryRequest
      | R4TypeHistoryRequest,
  ): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>>;
}
