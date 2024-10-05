/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementNode } from "@iguhealth/codegen/generate/meta-data";
import {
  Resource as R4Resource,
  Element,
  Reference,
  uri,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, R4 } from "@iguhealth/fhir-types/versions";

import {
  IMetaValue,
  IMetaValueArray,
  Location,
  TypeInfo,
} from "../interface.js";
import { descendLoc } from "../loc.js";
import {
  FHIRPathPrimitive as FHIRPrimitive,
  RawPrimitive,
  isArray,
  isFPPrimitive,
  isObject,
  isPrimitiveType,
  toFPPrimitive,
} from "../utilities.js";
import { getResolvedMeta, getStartingMeta } from "./meta.js";

class MetaValueV2Array<T> implements IMetaValueArray<T> {
  private _value: Array<MetaValueV2Singular<T>>;
  private _meta: ElementNode;
  private _fhirVersion: FHIR_VERSION;

  private _location: Location;

  constructor(
    fhirVersion: FHIR_VERSION,
    base: string,
    meta: ElementNode,
    value: Array<T>,
    location: Location,
  ) {
    this._value = value.map((v, i) => {
      if (v instanceof MetaValueV2Singular) return v;
      return new MetaValueV2Singular(
        fhirVersion,
        base,
        { ...meta, cardinality: "single" },
        v,
        [...location, i],
      );
    });
    this._meta = meta;
    this._fhirVersion = fhirVersion;
    this._location = location;
  }
  keys(): (string | number)[] {
    throw new Error("Method not allowed on arrays.");
  }
  getValue(): Array<T> {
    return this._value.map((v) => v.getValue());
  }
  isType(type: string): boolean {
    if (this.meta()?.type === "Reference" && type !== "Reference") {
      return (this.getValue() as Reference).reference?.split("/")[0] === type;
    }

    if (this.meta()?.type) {
      return this.meta()?.type === type;
    }

    return (
      (this.getValue() as unknown as R4Resource | undefined)?.resourceType ===
      type
    );
  }
  toArray(): Array<MetaValueV2Singular<T>> {
    return this._value;
  }
  isArray(): this is MetaValueV2Array<Array<T>> {
    return true;
  }
  meta(): TypeInfo | undefined {
    return {
      type: this._meta.type,
      fhirVersion: this._fhirVersion,
      cardinality: this._meta.cardinality,
    };
  }
  location(): Location {
    return this._location;
  }
  descend(field: number): IMetaValue<unknown> | undefined {
    return this._value[field];
  }
}

function deriveFHIRPrimitives(
  value: RawPrimitive | RawPrimitive[] | undefined,
  element: Element | Element[] | undefined,
): FHIRPrimitive<RawPrimitive> | FHIRPrimitive<RawPrimitive>[] | undefined {
  if (value === undefined && element === undefined) return undefined;
  if (isArray(value)) {
    return value.map((v, i) =>
      toFPPrimitive(v, (element as Element[] | undefined)?.[i]),
    );
  }
  return toFPPrimitive(value, element as Element);
}

class MetaValueV2Singular<T> implements IMetaValue<T> {
  private _value: T | FHIRPrimitive<RawPrimitive>;
  private _meta: ElementNode;
  private _fhirVersion: FHIR_VERSION;
  private _base: string;

  private _location: Location;

  constructor(
    fhirVersion: FHIR_VERSION,
    base: string,
    meta: ElementNode,
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
  keys() {
    if ("properties" in this._meta) {
      return Object.keys(this._meta.properties ?? {});
    }
    return [];
  }
  meta(): TypeInfo | undefined {
    return {
      type: this._meta.type,
      fhirVersion: this._fhirVersion,
      cardinality: this._meta.cardinality,
    };
  }
  isArray(): this is MetaValueV2Array<T> {
    return false;
  }
  isType(type: string): boolean {
    if (this.meta()?.type === "Reference" && type !== "Reference") {
      return (this.getValue() as Reference).reference?.split("/")[0] === type;
    }

    if (this.meta()?.type) {
      return this.meta()?.type === type;
    }

    return (
      (this.getValue() as unknown as R4Resource | undefined)?.resourceType ===
      type
    );
  }
  location(): Location {
    return this._location;
  }
  descend(_field: string): IMetaValue<unknown> | undefined {
    const nextMeta = getResolvedMeta(
      this._fhirVersion,
      this._base,
      this._meta,
      this._value,
      _field,
    );
    if (!nextMeta?.meta) return undefined;

    switch (true) {
      case isPrimitiveType((nextMeta.meta as ElementNode).type): {
        const value = (this._value as any)?.[nextMeta.field];
        const element = (this._value as any)?.[`_${nextMeta.field}`];

        switch (true) {
          case value === undefined && element === undefined: {
            return undefined;
          }
          case nextMeta.meta.cardinality === "array": {
            return new MetaValueV2Array(
              this._fhirVersion,
              nextMeta.base,
              nextMeta.meta as ElementNode,
              [
                ...new Array(
                  Math.max(value?.length ?? 0, element?.length ?? 0),
                ),
              ].map((_z, i) => toFPPrimitive(value?.[i], element?.[i])),
              descendLoc(this, nextMeta.field),
            );
          }
          default: {
            return new MetaValueV2Singular(
              this._fhirVersion,
              nextMeta.base,
              nextMeta.meta as ElementNode,
              toFPPrimitive(value, element),
              descendLoc(this, nextMeta.field),
            );
          }
        }
      }
      default: {
        const value = (this._value as any)?.[nextMeta.field];
        switch (true) {
          case value === undefined: {
            return undefined;
          }
          case nextMeta.meta.cardinality === "array": {
            return new MetaValueV2Array(
              this._fhirVersion,
              nextMeta.base,
              nextMeta.meta as ElementNode,
              (this._value as any)?.[nextMeta.field] ?? [],
              descendLoc(this, nextMeta.field),
            );
          }
          default: {
            return new MetaValueV2Singular(
              this._fhirVersion,
              nextMeta.base,
              nextMeta.meta as ElementNode,
              (this._value as any)?.[nextMeta.field],
              descendLoc(this, nextMeta.field),
            );
          }
        }
      }
    }
  }
}

class NonMetaValue<T> implements IMetaValue<T> {
  private _value: T;
  private _fhirVersion: FHIR_VERSION;
  private _location: Location;

  constructor(fhirVersion: FHIR_VERSION, value: T, location: Location) {
    this._value = value;
    this._fhirVersion = fhirVersion;
    this._location = location;
  }
  meta(): TypeInfo | undefined {
    return undefined;
  }
  isType(type: string): boolean {
    return (
      (this.getValue() as unknown as R4Resource | undefined)?.resourceType ===
      type
    );
  }
  keys() {
    if (isObject(this._value)) {
      return Object.keys(this._value);
    }
    return [];
  }
  getValue(): T {
    return this._value;
  }
  toArray(): IMetaValue<T>[] {
    if (this.isArray()) {
      return (this._value as any)?.map((v: any, i: number) => {
        return new NonMetaValue(this._fhirVersion, v, [...this._location, i]);
      });
    }
    return [this];
  }
  isArray(): this is IMetaValueArray<T> {
    return isArray(this._value);
  }
  location(): Location | undefined {
    return this._location;
  }
  descend(field: string | number): IMetaValue<unknown> | undefined {
    const value = (this._value as any)?.[field];

    switch (true) {
      // When we can with primitives set them to a type.
      case (this._value as any)?.[`_${field}`] !== undefined: {
        const fpPrimitive = deriveFHIRPrimitives(
          value,
          (this._value as any)?.[`_${field}`] as
            | Element
            | Element[]
            | undefined,
        );

        if (Array.isArray(fpPrimitive)) {
          return new MetaValueV2Array(
            R4,
            "Element",
            getStartingMeta(R4, "Element" as uri) as ElementNode,
            fpPrimitive,
            descendLoc(this, field.toString()),
          );
        } else {
          return new MetaValueV2Singular(
            R4,
            "Element",
            {
              ...(getStartingMeta(R4, "Element" as uri) as ElementNode),
              cardinality: "single",
            } as ElementNode,
            fpPrimitive,
            descendLoc(this, field.toString()),
          );
        }
      }

      case value === undefined: {
        return undefined;
      }

      default: {
        // Should handle array for type determination?
        const type = attemptDetermineType(value);
        if (type) {
          const meta = getStartingMeta(R4, type);

          if (isArray(value)) {
            return new MetaValueV2Array(
              R4,
              type,
              meta as ElementNode,
              value,
              descendLoc(this, field.toString()),
            );
          } else {
            return new MetaValueV2Singular(
              R4,
              type,
              meta as ElementNode,
              value,
              descendLoc(this, field.toString()),
            );
          }
        } else {
          return new NonMetaValue(
            this._fhirVersion,
            value,
            descendLoc(this, field.toString()),
          );
        }
      }
    }
  }
}

function attemptDetermineType(value: unknown): uri | undefined {
  if (isObject(value) && typeof value.resourceType === "string") {
    return value.resourceType as uri;
  }
  return undefined;
}

export function metaValue<T>(
  { type, fhirVersion }: Partial<TypeInfo> | undefined = { fhirVersion: R4 },
  value: T | T[],
  location: Location = [],
): IMetaValue<NonNullable<T>> | IMetaValueArray<NonNullable<T>> | undefined {
  switch (true) {
    case value === undefined: {
      return undefined;
    }
    case value instanceof MetaValueV2Array ||
      value instanceof MetaValueV2Singular: {
      return value;
    }
    default: {
      // Assign a type automatically if the value is a resourceType
      type = type ?? attemptDetermineType(value);
      if (!fhirVersion) {
        fhirVersion = R4;
      }

      const meta = getStartingMeta(fhirVersion, type as uri);

      switch (true) {
        case meta === undefined || type === undefined: {
          return new NonMetaValue(
            fhirVersion,
            value as NonNullable<T>,
            location,
          );
        }
        case isArray(value): {
          return new MetaValueV2Array(
            fhirVersion,
            type, // Start as base because resource root is not specified in elements
            meta,
            value as NonNullable<T>[],
            location,
          );
        }
        default: {
          return new MetaValueV2Singular(
            fhirVersion,
            type, // Start as base because resource root is not specified in elements
            meta,
            value as NonNullable<T>,
            location,
          );
        }
      }
    }
  }
}
