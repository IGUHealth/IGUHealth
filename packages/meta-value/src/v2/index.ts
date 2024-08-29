import { MetaNode, MetaV2Compiled } from "@iguhealth/codegen";
import { uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";

import {
  IMetaValue,
  IMetaValueArray,
  Location,
  TypeInfo,
} from "../interface.js";
import { descendLoc } from "../loc.js";
import {
  FHIRPathPrimitive,
  RawPrimitive,
  isArray,
  isFPPrimitive,
  isObject,
  isPrimitiveType,
  toFPPrimitive,
} from "../utilities.js";
import _r4Meta from "./generated/r4.json" with { type: "json" };
import _r4bMeta from "./generated/r4b.json" with { type: "json" };

const R4_META: MetaV2Compiled = _r4Meta as unknown as MetaV2Compiled;
const R4B_META: MetaV2Compiled = _r4bMeta as unknown as MetaV2Compiled;

function getGlobalMeta(fhirVersion: FHIR_VERSION): MetaV2Compiled {
  switch (fhirVersion) {
    case R4:
      return R4_META;
    case R4B:
      return R4B_META;
    default:
      throw new Error(`Unsupported FHIR version: ${fhirVersion}`);
  }
}

function getMeta(
  fhirVersion: FHIR_VERSION,
  base: string,
  meta: MetaNode,
  field: string,
): { base: string; meta: MetaNode } | undefined {
  const globalMeta = getGlobalMeta(fhirVersion);
  switch (true) {
    case meta.properties !== undefined: {
      return { base, meta: globalMeta[base][meta.properties?.[field]] };
    }
    default: {
      const index = globalMeta[meta.type][0]?.properties?.[field];
      if (!index)
        throw new Error(`Could not find index for ${field} in ${meta.type}`);

      return { base: meta.type, meta: globalMeta[meta.type][index] };
    }
  }
}

class MetaValueV2Array<T> implements IMetaValueArray<T> {
  private _value: Array<MetaValueV2Singular<T>>;
  private _meta: MetaNode;
  private _fhirVersion: FHIR_VERSION;
  private _base: string;

  private _location: Location;

  constructor(
    fhirVersion: FHIR_VERSION,
    base: string,
    meta: MetaNode,
    value: Array<T>,
    location: Location,
  ) {
    this._value = value.map((v, i) => {
      if (v instanceof MetaValueV2Singular) return v;
      return new MetaValueV2Singular(fhirVersion, base, meta, v, [
        ...location,
        i,
      ]);
    });
    this._meta = meta;
    this._fhirVersion = fhirVersion;
    this._location = location;
    this._base = base;
  }

  getValue(): Array<T> {
    return this._value.map((v) => v.getValue());
  }
  toArray(): Array<MetaValueV2Singular<T>> {
    return this._value;
  }
  isArray(): this is MetaValueV2Array<Array<T>> {
    return true;
  }
  meta(): TypeInfo | undefined {
    return { type: this._meta.type, fhirVersion: this._fhirVersion };
  }
  location(): Location {
    return this._location;
  }
  descend(field: number): IMetaValue<unknown> | undefined {
    return this._value[field];
  }
}

class MetaValueV2Singular<T> implements IMetaValue<T> {
  private _value: T | FHIRPathPrimitive<RawPrimitive>;
  private _meta: MetaNode;
  private _fhirVersion: FHIR_VERSION;
  private _base: string;

  private _location: Location;

  constructor(
    fhirVersion: FHIR_VERSION,
    base: string,
    meta: MetaNode,
    value: T,
    location: Location,
  ) {
    this._fhirVersion = fhirVersion;
    this._base = base;
    this._meta = meta;
    this._value = value;
    this._base = base;

    this._location = location;
  }
  get _internal_meta_() {
    return this._meta;
  }
  getValue(): T {
    if (isFPPrimitive(this._value)) {
      return this._value.value as T;
    }
    return this._value;
  }
  meta(): TypeInfo | undefined {
    return { type: this._meta.type, fhirVersion: this._fhirVersion };
  }
  isArray(): this is MetaValueV2Array<T> {
    return false;
  }
  location(): Location {
    return this._location;
  }
  descend(field: string): IMetaValue<unknown> | undefined {
    const info = getMeta(this._fhirVersion, this._base, this._meta, field);
    if (!info) return undefined;

    console.log(info.meta);

    switch (true) {
      case isPrimitiveType(info.meta.type): {
        const value = (this._value as any)?.[field];
        const element = (this._value as any)?.[`_${field}`];

        if (info.meta.cardinality === "array") {
          return new MetaValueV2Array(
            this._fhirVersion,
            info.base,
            info.meta,
            [
              ...new Array(Math.max(value?.length ?? 0, element?.length ?? 0)),
            ].map((_z, i) => toFPPrimitive(value?.[i], element?.[i])),
            descendLoc(this, field),
          );
        } else {
          return new MetaValueV2Singular(
            this._fhirVersion,
            info.base,
            info.meta,
            toFPPrimitive(value, element),
            descendLoc(this, field),
          );
        }
      }
      default: {
        if (info.meta.cardinality === "array") {
          return new MetaValueV2Array(
            this._fhirVersion,
            info.base,
            info.meta,
            (this._value as any)?.[field] ?? [],
            descendLoc(this, field),
          );
        } else {
          return new MetaValueV2Singular(
            this._fhirVersion,
            info.base,
            info.meta,
            (this._value as any)?.[field],
            descendLoc(this, field),
          );
        }
      }
    }
  }
}

export function metaValue<T>(
  meta: Partial<TypeInfo>,
  value: T | T[],
  location?: Location,
): IMetaValue<NonNullable<T>> | IMetaValueArray<NonNullable<T>> | undefined {
  switch (true) {
    case value === undefined: {
      return undefined;
    }
    case value instanceof MetaValueV2Array ||
      value instanceof MetaValueV2Singular: {
      throw new Error("Cannot create a MetaValue from another MetaValue");
    }
    default: {
      // Assign a type automatically if the value is a resourceType
      if (isObject(value) && typeof value.resourceType === "string") {
        meta.type = value.resourceType as uri;
      }
      if (!meta.type) {
        throw new Error("Type is required");
      }

      if (!meta.fhirVersion) {
        meta.fhirVersion = R4;
      }

      if (isArray(value)) {
        return new MetaValueV2Array(
          meta.fhirVersion,
          meta.type,
          getGlobalMeta(meta.fhirVersion)[meta.type][0],
          value as NonNullable<T>[],
          location ?? [],
        );
      } else {
        return new MetaValueV2Singular(
          meta.fhirVersion,
          meta.type,
          getGlobalMeta(meta.fhirVersion)[meta.type][0],
          value as NonNullable<T>,
          location ?? [],
        );
      }
    }
  }
}
