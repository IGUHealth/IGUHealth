import { canonical, uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

export interface ValidationCTX {
  fhirVersion: FHIR_VERSION;
  resolveTypeToCanonical<Version extends FHIR_VERSION>(
    version: Version,
    type: uri,
  ): Promise<canonical | undefined>;
  resolveCanonical: <
    FHIRVersion extends FHIR_VERSION,
    Type extends ResourceType<FHIRVersion>,
  >(
    fhirVersion: FHIRVersion,
    type: Type,
    url: canonical,
  ) => Promise<Resource<FHIRVersion, Type> | undefined>;
  validateCode?(system: string, code: string): Promise<boolean>;
}

export type Validator = (
  input: unknown,
) => Promise<Resource<FHIR_VERSION, "OperationOutcome">["issue"]>;
