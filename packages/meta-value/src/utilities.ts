import { primitiveTypes } from "@iguhealth/fhir-types/lib/generated/r4/sets";
import { Element } from "@iguhealth/fhir-types/r4/types";

import { IMetaValue, IMetaValueArray } from "./interface.js";

export type RawPrimitive = string | number | boolean | undefined;
export type FHIRPathPrimitive<T extends RawPrimitive> = Element & {
  _type_: "primitive";
  value: T;
};
export function isPrimitiveType(type: string) {
  return primitiveTypes.has(type);
}

export function isFPPrimitive(
  v: unknown,
): v is FHIRPathPrimitive<RawPrimitive> {
  return isObject(v) && v._type_ === "primitive";
}

export function toFPPrimitive<T extends RawPrimitive>(
  value: T,
  element?: Element,
): FHIRPathPrimitive<T> {
  return { ...element, value, _type_: "primitive" };
}

export function isRawPrimitive(v: unknown): v is RawPrimitive {
  return (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean" ||
    v === undefined
  );
}

export function isObject(value: unknown): value is { [key: string]: unknown } {
  return value !== null && typeof value === "object";
}

export function isArray<T>(v: T | T[]): v is T[] {
  return Array.isArray(v);
}

export function flatten<T>(
  node: IMetaValue<T> | IMetaValueArray<T> | undefined,
): IMetaValue<T>[] {
  switch (true) {
    case node === undefined: {
      return [];
    }
    case node?.isArray(): {
      return node.toArray();
    }
    case node && node.isArray() === false: {
      return [node];
    }
    default: {
      throw new Error("Should not reach here");
    }
  }
}
