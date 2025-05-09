import * as s from "zapatos/schema";

import {
  HistoryInstanceRequest,
  SystemHistoryRequest,
  TypeHistoryRequest,
} from "@iguhealth/client/types";
import { id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

export type Insertable = Extract<s.Table, "resources">;

export interface FHIRResourceStore<CTX> {
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

  readLatestResourceById<
    Version extends FHIR_VERSION,
    Type extends ResourceType<Version>,
  >(
    ctx: CTX,
    fhirVersion: Version,
    type: Type,
    id: id,
  ): Promise<Resource<Version, Type> | undefined>;

  history<Version extends FHIR_VERSION>(
    ctx: CTX,
    request:
      | HistoryInstanceRequest<FHIR_VERSION>
      | SystemHistoryRequest<FHIR_VERSION>
      | TypeHistoryRequest<FHIR_VERSION>,
  ): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>>;

  getSequence(
    sequenceId: number,
    count?: number,
  ): Promise<s.resources.JSONSelectable[]>;
}
