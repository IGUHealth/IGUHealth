export type FHIRPathNode<T> = {
  value: T;
};

function isArray<T>(v: T | T[]): v is T[] {
  return Array.isArray(v);
}

function toCollection<T>(v: T | T[]): T[] {
  if (isArray(v)) {
    return v;
  } else {
    return [v];
  }
}

export function toFhirPathNode<T>(value: T): FHIRPathNode<T>[] {
  if (isArray(value)) {
    return value.map((v) => ({ value: v }));
  }
  return [{ value }];
}

export function getValue<T>(node: FHIRPathNode<T>) {
  return node.value;
}

function isObject(value: unknown): value is { [key: string]: unknown } {
  return value instanceof Object;
}

export function descend<T>(
  node: FHIRPathNode<T>,
  field: string
): FHIRPathNode<unknown>[] {
  const rawValue = getValue(node);
  if (isObject(rawValue)) {
    return toFhirPathNode(rawValue[field]);
  }
  return [];
}
