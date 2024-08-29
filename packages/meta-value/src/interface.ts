import * as r4 from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

export type Location = (string | number)[];

export interface TypeInfo {
  fhirVersion: FHIR_VERSION;
  type: r4.uri;
}

export interface IMetaValue<T> {
  meta(): TypeInfo | undefined;
  getValue(): T;
  isArray(): this is IMetaValueArray<T>;
  location(): Location | undefined;
  descend(field: string | number): IMetaValue<unknown> | undefined;
}

export interface IMetaValueArray<T> extends IMetaValue<T[]> {
  toArray(): IMetaValue<T>[];
}
