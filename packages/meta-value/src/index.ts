import {
  StructureDefinition,
  Resource,
  ElementDefinition,
  code,
} from "@genfhi/fhir-types/r4/types";
import { complexTypes } from "@genfhi/fhir-types/r4/sets";

type MetaInformation = {
  sd: StructureDefinition;
  elementIndex: number;
  // Typechoice so need to maintain the type here.
  type: string;
  cardinality: "many" | "singular";
};

function Comparison(
  element: ElementDefinition,
  path: string
): code | undefined {
  if (element.path === path) return element.type?.[0].code;
  if (
    element.type &&
    element.type?.length > 1 &&
    path.startsWith(element.path.replace("[x]", ""))
  ) {
    for (let type of element.type) {
      if (element.path.replace("[x]", type.code) === path) return type.code;
    }
  }
  return undefined;
}

// [TODO] Primitive value extensions which start with _

function isComplexType(type: string): boolean {
  return (
    complexTypes.has(type) && type !== "Element" && type !== "BackboneElement"
  );
}

function findNextElementIndex(
  meta: MetaInformation | undefined,
  field: string,
  getSD?: (type: code) => StructureDefinition
): MetaInformation | undefined {
  if (meta?.elementIndex !== undefined) {
    const curElement = meta.sd.snapshot?.element[meta.elementIndex];
    const nextElementPath = `${curElement?.path}.${field.toString()}`;
    let i = meta.elementIndex + 1;
    while (i < (meta.sd.snapshot?.element.length || 0)) {
      const elementToCheck = meta.sd.snapshot?.element[i];
      // Comparison returns the type of the field to element if valid.
      const type =
        elementToCheck && Comparison(elementToCheck, nextElementPath);
      if (type) {
        return {
          sd: meta.sd,
          type: type,
          elementIndex: i,
          cardinality: elementToCheck.max !== "1" ? "many" : "singular",
        };
      }
      i++;
    }
  }
  return undefined;
}

interface MetaValue<T> {
  valueOf(): T;
}

class MetaValueSingular<T> implements MetaValue<T> {
  private value: T;
  constructor(
    metaInformation: MetaInformation,
    value: T,
    getSD: (type: code) => StructureDefinition
  ) {
    this.value = value;
  }
  valueOf(): T {
    return this.value;
  }
}

class MetaValueArray<T> implements MetaValue<Array<T>> {
  private value: Array<MetaValueSingular<T>>;
  constructor(
    metaInformation: MetaInformation,
    value: Array<T>,
    getSD: (type: code) => StructureDefinition
  ) {
    this.value = value.map(
      (v) => new MetaValueSingular(metaInformation, v, getSD)
    );
  }
  valueOf(): Array<T> {
    return this.value.map((v) => v.valueOf());
  }
  toArray(): Array<MetaValueSingular<T>> {
    return this.value;
  }
}

export function createProxy<T>(
  { meta, value }: { meta: MetaInformation | undefined; value: any },
  getSD?: (v: string) => StructureDefinition
): InstanceType<typeof Proxy> | undefined | string {
  if (value && value.resourceType && meta?.sd.type !== value.resourceType)
    throw new Error(
      `Expected '${meta?.sd.type}' but found value of '${value.resourceType}'`
    );
  const proxy = new Proxy(
    { meta, value },
    {
      get: ({ meta, value }: any, field: string | symbol, receiver) => {
        // Special field to return the contextual information
        if (field === "__meta__") {
          return meta;
        }
        const nextTarget = value[field];
        const nextMeta = findNextElementIndex(meta, field.toString(), getSD);
        if (nextTarget instanceof Function) {
          return function (...args: any[]) {
            // @ts-ignore
            return nextTarget.apply(this === receiver ? value : this, args);
          };
        }
        if (Array.isArray(nextTarget)) {
          return nextTarget.map((v) =>
            createProxy(
              {
                meta: nextMeta && { ...nextMeta, cardinality: "singular" },
                value: v,
              },
              getSD
            )
          );
        }
        return createProxy({ meta: nextMeta, value: nextTarget }, getSD);
      },
    }
  );

  return proxy;
}
