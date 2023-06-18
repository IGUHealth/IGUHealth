import { Element } from "@genfhi/fhir-types/r4";

export type FHIRPathNode<T> = {
  value: T;
};

export type FHIRPathPrimitive = {
  _type_: "primitive";
  value?: string | number | boolean;
} & Element;

function isObject(value: unknown): value is { [key: string]: unknown } {
  return value instanceof Object;
}

function isArray<T>(v: T | T[]): v is T[] {
  return Array.isArray(v);
}

function toCollection<T>(v: T | T[]): T[] {
  if (isArray(v)) {
    return v;
  }
  return [v];
}

function isRawPrimitive(v: unknown): v is string | number | boolean {
  return (
    typeof v === "string" || typeof v === "number" || typeof v === "boolean"
  );
}

function isFPPrimitive(v: unknown): v is FHIRPathPrimitive {
  return isObject(v) && v._type_ === "primitive";
}

function _toValue<T>(
  value: T,
  element?: Element
): FHIRPathPrimitive | NonNullable<T> {
  if (isRawPrimitive(value) || element) {
    const fhirPrimitive: FHIRPathPrimitive = {
      _type_: "primitive",
      ...element,
    };
    if (isRawPrimitive(value)) return { ...fhirPrimitive, value };
    return fhirPrimitive;
  }
  if (value === undefined || value === null)
    throw new Error("Cannot convert undefined to FHIRPathNode");
  return value;
}

export function toFhirPathNode<T>(
  value: T,
  element?: Element | Element[]
): FHIRPathNode<NonNullable<T> | FHIRPathPrimitive>[] {
  if ((value === undefined || value === null) && element === undefined)
    return [];
  else if (isArray(value)) {
    return value.map((v, i: number) => ({
      value: _toValue(v, element && (element as Element[])[i]),
    }));
  }
  return [{ value: _toValue(value, element as Element) }];
}

export function getValue<T>(
  node: FHIRPathNode<T>
): T | string | number | boolean | undefined {
  if (isFPPrimitive(node.value)) return node.value?.value;
  return node.value;
}

export function descend<T>(
  node: FHIRPathNode<T>,
  field: string
): Readonly<FHIRPathNode<NonNullable<unknown>>[]> {
  const internalValue = node.value;
  if (isObject(internalValue)) {
    let v = internalValue[field];
    let extension = internalValue[`_${field}`] as
      | Element[]
      | Element
      | undefined;
    return toFhirPathNode(v, extension);
  }
  return [];
}
