import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";

import { IMetaValue, IMetaValueArray } from "../interface.js";
import { TypeMeta, deriveNextMetaInformation, initializeMeta } from "./meta.js";

type Element = r4.Element | r4b.Element;
type uri = r4.uri | r4b.uri;
type Location = (string | number)[];

export { TypeMeta };
type Meta = { location: Location; type: TypeMeta | undefined };
export type PartialMeta = { location?: Location; type?: Partial<TypeMeta> };

type RawPrimitive = string | number | boolean | undefined;
type FHIRPathPrimitive<T extends RawPrimitive> = Element & {
  _type_: "primitive";
  value: T;
};

function isFPPrimitive(v: unknown): v is FHIRPathPrimitive<RawPrimitive> {
  return isObject(v) && v._type_ === "primitive";
}

function toFPPrimitive<T extends RawPrimitive>(
  value: T,
  element?: Element,
): FHIRPathPrimitive<T> {
  return { ...element, value, _type_: "primitive" };
}

function isRawPrimitive(v: unknown): v is RawPrimitive {
  return (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean" ||
    v === undefined
  );
}

function isObject(value: unknown): value is { [key: string]: unknown } {
  return value !== null && typeof value === "object";
}

function isArray<T>(v: T | T[]): v is T[] {
  return Array.isArray(v);
}

function getField<T extends { [key: string]: unknown }>(
  value: T,
  field: string,
): string | undefined {
  if (Object.prototype.hasOwnProperty.call(value, field)) return field;
  const reg = new RegExp(`^(_?)${field}([A-Z].*)?$`);
  const foundField = Object.keys(value).find((k) => reg.test(k));

  return foundField?.startsWith("_") ? foundField.substring(1) : foundField;
}

export async function metaValue<T>(
  initialMeta: PartialMeta,
  value: T | T[],
  element?: Element | Element[],
): Promise<
  | MetaValueSingular<NonNullable<T>>
  | MetaValueArrayImpl<NonNullable<T>>
  | undefined
> {
  if (value instanceof MetaValueArrayImpl || value instanceof MetaValueSingular)
    return value;
  // Assign a type automatically if the value is a resourceType
  if (isObject(value) && typeof value.resourceType === "string")
    initialMeta = {
      ...initialMeta,
      type: initialMeta.type
        ? { ...initialMeta.type, type: value.resourceType as uri }
        : undefined,
    };
  const meta = {
    location: initialMeta.location ? initialMeta.location : [],
    type: await initializeMeta(initialMeta.type),
  };
  if ((value === undefined || value === null) && element === undefined)
    return undefined;

  if (isArray(value)) {
    return new MetaValueArrayImpl(
      meta,
      value as NonNullable<T>[],
      element && isArray(element) ? element : undefined,
    );
  }

  return new MetaValueSingular(
    meta,
    value as NonNullable<T>,
    element as Element | undefined,
  );
}

// Need special handling for primitives which if going into elements will need to use _field.
function descendLoc<T>(v: MetaValueSingular<T>, field: string): Location {
  const loc = v.location() || [];
  // Need special handling for .value and extensions which are under _fieldName for primitives.
  if (isFPPrimitive(v.internalValue)) {
    if (field === "value") return loc;
    // Handle Array and singular
    // Array primitives parents will be number over field.
    if (typeof loc[loc.length - 1] === "number") {
      return [
        ...loc.slice(0, loc.length - 2),
        `_${loc[loc.length - 2]}`,
        loc[loc.length - 1],
        field,
      ];
    } else {
      return [
        ...loc.slice(0, loc.length - 1),
        `_${loc[loc.length - 1]}`,
        field,
      ];
    }
  }
  return [...loc, field];
}

export async function descend<T>(
  node: IMetaValue<T>,
  field: string,
): Promise<IMetaValue<NonNullable<unknown>> | undefined> {
  if (node instanceof MetaValueSingular) {
    const internalValue = node.internalValue;
    if (isObject(internalValue)) {
      const computedField = getField(internalValue, field);
      if (computedField) {
        const v = internalValue[computedField];
        const elementValue = internalValue[`_${computedField}`] as
          | Element[]
          | Element
          | undefined;
        const nextMeta = {
          location: descendLoc(node, computedField),
          type: await deriveNextMetaInformation(node.meta(), computedField),
        };

        return metaValue(nextMeta, v, elementValue);
      }
    }
  }
  return undefined;
}

export function flatten<T>(
  node: IMetaValue<T> | IMetaValue<T[]> | undefined,
): MetaValueSingular<T>[] {
  if (node instanceof MetaValueArrayImpl) return node.toArray();
  if (node instanceof MetaValueSingular) return [node];
  return [];
}

class MetaValueArrayImpl<T> implements IMetaValueArray<T> {
  private value: Array<MetaValueSingular<T>>;
  private _meta: Meta;
  constructor(meta: Meta, value: Array<T>, element?: Element[]) {
    this.value = value.map((v, i: number) => {
      if (v instanceof MetaValueSingular) return v;
      return new MetaValueSingular(
        {
          ...meta,
          location: [...meta.location, i],
        },
        v,
        element ? element[i] : undefined,
      );
    });
    this._meta = meta;
  }
  getValue(): Array<T> {
    return this.value.map((v) => v.getValue());
  }
  toArray(): Array<MetaValueSingular<T>> {
    return this.value;
  }
  isArray(): this is MetaValueArrayImpl<Array<T>> {
    return true;
  }
  meta(): TypeMeta | undefined {
    return this._meta.type;
  }
  location(): Location {
    return this._meta.location;
  }
}

class MetaValueSingular<T> implements IMetaValue<T> {
  private _value: T | FHIRPathPrimitive<RawPrimitive>;
  private _meta: Meta;
  constructor(meta: Meta, value: T, element?: Element) {
    if (isRawPrimitive(value) || element !== undefined) {
      this._value = toFPPrimitive(
        isRawPrimitive(value) ? value : undefined,
        element,
      );
    } else {
      this._value = value;
    }

    this._meta = meta;
  }
  get internalValue() {
    return this._value;
  }
  getValue(): T {
    if (isFPPrimitive(this._value)) return this._value.value as T;
    return this._value;
  }
  meta(): TypeMeta | undefined {
    return this._meta.type;
  }
  isArray(): this is MetaValueArrayImpl<T> {
    return false;
  }
  location(): Location {
    return this._meta.location;
  }
}
