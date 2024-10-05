import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import {
  IMetaValue,
  IMetaValueArray,
  Location,
  TypeInfo,
} from "../interface.js";
import { uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { getResolvedMeta } from "./meta.js";
import { ElementNode } from "@iguhealth/codegen/generate/meta-data";

export class SpoofMetaValueV2 implements IMetaValue<undefined> {
  private readonly _fhirVersion: FHIR_VERSION;
  private readonly _base: uri;
  private readonly _meta: ElementNode;

  constructor(fhirVersion: FHIR_VERSION, base: uri, meta: ElementNode) {
    this._fhirVersion = fhirVersion;
    this._base = base;
    this._meta = meta;
    this._base = base;
  }

  meta(): TypeInfo | undefined {
    return {
      type: this._meta.type,
      fhirVersion: this._fhirVersion,
      cardinality: this._meta.cardinality,
    };
  }
  getValue(): undefined {
    throw new Error("Method not implemented.");
  }
  isArray(): this is IMetaValueArray<undefined> {
    throw new Error("Method not implemented.");
  }
  location(): Location | undefined {
    throw new Error("Method not implemented.");
  }
  isType(_type: string): boolean {
    throw new Error("Method not implemented.");
  }
  descend(field: string | number): IMetaValue<unknown> | undefined {
    if (!this._meta) {
      return undefined;
    }

    if (typeof field === "number") {
      if (this._meta.cardinality === "single") return undefined;
      return new SpoofMetaValueV2(this._fhirVersion, this._base, {
        ...this._meta,
        cardinality: "single",
      });
    }

    const nextMeta = getResolvedMeta(
      this._fhirVersion,
      this._base,
      this._meta,
      {},
      field.toString(),
    );

    if (!nextMeta?.meta) return undefined;

    return new SpoofMetaValueV2(
      this._fhirVersion,
      nextMeta.base as uri,
      nextMeta.meta,
    );
  }
  keys(): (string | number)[] {
    throw new Error("Method not implemented.");
  }
}
