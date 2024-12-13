import * as s from "zapatos/schema";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

export interface ResourceStore {
  read<Version extends FHIR_VERSION>(
    tenant: TenantId,
    fhirVersion: Version,
    version_ids: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;

  insert<Version extends FHIR_VERSION>(
    data: s.resources.Insertable[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;
}
