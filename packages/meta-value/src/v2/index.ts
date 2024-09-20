/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ElementNode,
  MetaNode,
  MetaV2Compiled,
} from "@iguhealth/codegen/generate/meta-data";
import { Element, uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";

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

function getStartingMeta(
  fhirVersion: FHIR_VERSION,
  type: uri,
): ElementNode | undefined {
  return getGlobalMeta(fhirVersion)[type]?.[0] as ElementNode | undefined;
}

function getMeta<T>(
  fhirVersion: FHIR_VERSION,
  base: string,
  meta: ElementNode,
  value: T | FHIRPrimitive<RawPrimitive>,
  field: string,
): { base: string; meta?: MetaNode; field: string } | undefined {
  const globalMeta = getGlobalMeta(fhirVersion);

  const nextMeta = globalMeta[base][meta.properties?.[field] ?? -1];

  switch (true) {
    case nextMeta === undefined: {
      return undefined;
    }
    case nextMeta._type_ === "type": {
      // Special handling for Bundle.entry.resource which is abstract Resource;
      // Descend into the resourceType field to get the actual type.
      if (nextMeta.type === "Resource" || nextMeta.type === "DomainResource") {
        const type =
          isObject(value) && isObject(value?.[field])
            ? (value?.[field]?.resourceType as uri)
            : nextMeta.type;

        return {
          field,
          base: type,
          meta: {
            ...(getStartingMeta(fhirVersion, type) as ElementNode),
            cardinality: nextMeta.cardinality,
          },
        };
      } else {
        return {
          field,
          base: nextMeta.type,
          meta: {
            ...(getStartingMeta(fhirVersion, nextMeta.type) as ElementNode),
            cardinality: nextMeta.cardinality,
          },
        };
      }
    }
    case nextMeta._type_ === "typechoice": {
      for (const typeChoiceField of Object.keys(nextMeta.fields)) {
        if ((value as any)?.[typeChoiceField] !== undefined) {
          const typeChoiceMeta = getStartingMeta(
            fhirVersion,
            nextMeta.fields[typeChoiceField],
          ) as ElementNode;
          return {
            field: typeChoiceField,
            base: typeChoiceMeta.type,
            meta: {
              ...typeChoiceMeta,
              cardinality: nextMeta.cardinality,
            },
          };
        }
      }
      return undefined;
    }
    case nextMeta._type_ === "complex": {
      return { base, meta: nextMeta, field };
    }
    default: {
      // @ts-ignore
      throw new Error(`Unknown meta type: ${nextMeta._type_}`);
    }
  }
}

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
    return { type: this._meta.type, fhirVersion: this._fhirVersion };
  }
  isArray(): this is MetaValueV2Array<T> {
    return false;
  }
  location(): Location {
    return this._location;
  }
  descend(_field: string): IMetaValue<unknown> | undefined {
    const nextMeta = getMeta(
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
      throw new Error("Cannot create a MetaValue from another MetaValue");
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
