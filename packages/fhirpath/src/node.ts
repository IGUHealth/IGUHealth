import { Element } from "@genfhi/fhir-types/r4";

type RawPrimitive = string | number | boolean | undefined;
export type FHIRPathPrimitive<T extends RawPrimitive> = Element & {
  _type_: "primitive";
  value: T;
};

export type FHIRPathNodeType<T> = InstanceType<typeof FHIRPathNode<T>>;

function toFPPrimitive<T extends RawPrimitive>(
  value: T,
  element?: Element
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

class FHIRPathNode<T> {
  private readonly _internalValue: T | FHIRPathPrimitive<RawPrimitive>;
  constructor(value: T, element?: Element) {
    if (isRawPrimitive(value)) {
      this._internalValue = toFPPrimitive(value, element);
    } else {
      this._internalValue = value;
    }
  }
  get value(): T {
    if (isFPPrimitive(this.internalValue)) return this.internalValue.value as T;
    return this.internalValue;
  }

  get internalValue() {
    return this._internalValue;
  }
}

function isElement(
  element: Element | Element[] | undefined
): element is Element {
  return isArray(element) ? false : element instanceof Object;
}

export function toFPNodes<T>(
  value: T | T[],
  element?: Element | Element[]
): FHIRPathNode<T>[] {
  if (isArray(value)) {
    return value
      .map((v, i: number) =>
        toFPNodes(v, element && isArray(element) ? element[i] : undefined)
      )
      .reduce((acc, v) => [...acc, ...v], []);
  }
  if (value === undefined && element === undefined) return [];
  return [new FHIRPathNode(value, element as Element | undefined)];
}

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

function isFPPrimitive(v: unknown): v is FHIRPathPrimitive<RawPrimitive> {
  return isObject(v) && v._type_ === "primitive";
}

function getField<T extends { [key: string]: unknown }>(
  value: T,
  field: string
): string | undefined {
  if (value.hasOwnProperty(field)) return field;
  return Object.keys(value).find((k) => k.startsWith(field));
}

export function descend<T>(
  node: FHIRPathNode<T>,
  field: string
): FHIRPathNode<unknown>[] {
  const internalValue = node.internalValue;
  if (isObject(internalValue)) {
    const computedField = getField(internalValue, field);
    if (computedField) {
      let v = internalValue[computedField];
      let extension = internalValue[`_${computedField}`] as
        | Element[]
        | Element
        | undefined;
      return toFPNodes(v, extension);
    }
  }
  return [];
}
