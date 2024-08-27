import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { R4 } from "@iguhealth/fhir-types/versions";

type Location = (string | number)[];

export interface TypeInfo {
  fhirVersion: R4;
  type: r4.uri;
}

export interface MetaValue<T> {
  meta(): TypeInfo | undefined;
  getValue(): T;
  isArray(): this is MetaValue<T[]>;
  location(): Location | undefined;
}
