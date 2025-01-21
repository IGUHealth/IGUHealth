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

export type Insertable = Extract<s.Table, "users" | "resources" | "tenants">;

export interface ResourceStore<CTX> {
  insert<T extends Insertable>(
    ctx: CTX,
    type: T,
    data: s.InsertableForTable<T>,
  ): Promise<s.JSONSelectableForTable<T>>;

  readResourcesByVersionId<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    version_ids: id[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;

  readLatestResourceById<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    id: id,
  ): Promise<Resource<Version, AllResourceTypes> | undefined>;

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
