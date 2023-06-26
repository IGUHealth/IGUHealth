import { StructureDefinition, Resource } from "@genfhi/fhir-types/r4/types";

function findNextElementIndex(
  sd: StructureDefinition,
  startIndex: number | undefined,
  field: string
): number | undefined {
  if (startIndex !== undefined) {
    const curElement = sd.snapshot?.element[startIndex];
    const nextElementPath = `${curElement?.path}.${field.toString()}`;
    let i = startIndex++;
    while (i < (sd.snapshot?.element.length || 0)) {
      if (sd.snapshot?.element[i].path === nextElementPath) {
        return i;
      }
      i++;
    }
  }
  return undefined;
}

export function createProxy<T>(
  sd: StructureDefinition,
  value: any,
  elementIndex: number | undefined
  // getSD: (v: string) => StructureDefinition
): InstanceType<typeof Proxy> {
  if (value.resourceType && sd.type !== value.resourceType)
    throw new Error(
      `Expected '${sd.type}' but found value of '${value.resourceType}'`
    );

  const proxy = new Proxy(value, {
    get: (target, field, receiver) => {
      const curElement = elementIndex
        ? sd.snapshot?.element[elementIndex]
        : undefined;

      if (field === "__meta__") {
        return curElement;
      }

      const nextElementIndex = findNextElementIndex(
        sd,
        elementIndex,
        field.toString()
      );

      const nextTarget = target[field];
      if (nextTarget instanceof Function) {
        return function (...args: any[]) {
          // @ts-ignore
          return nextTarget.apply(this === receiver ? target : this, args);
        };
      }

      return createProxy(sd, nextTarget, nextElementIndex);
    },
  });

  return proxy;
}
