import {
  StructureDefinition,
  Element,
  ElementDefinition,
  code,
} from "@genfhi/fhir-types/r4/types";
import { complexTypes, resourceTypes } from "@genfhi/fhir-types/r4/sets";

//
function isResourceOrComplexType(type: string): boolean {
  return (
    (complexTypes.has(type) || resourceTypes.has(type)) &&
    // Because element and backbone can be used
    // in certain contexts to extend
    // just ignore for now
    type !== "Element" &&
    type !== "BackboneElement"
  );
}

type MetaInformation = {
  sd: StructureDefinition;
  elementIndex: number;
  // Typechoice so need to maintain the type here.
  type: string;
  getSD?: (type: code) => StructureDefinition | undefined;
};

interface MetaValue<T> {
  meta(): MetaInformation | undefined;
  valueOf(): T;
  isArray(): this is MetaValueArray<T>;
}

type RawPrimitive = string | number | boolean | undefined;
export type FHIRPathPrimitive<T extends RawPrimitive> = Element & {
  _type_: "primitive";
  value: T;
};

function isFPPrimitive(v: unknown): v is FHIRPathPrimitive<RawPrimitive> {
  return isObject(v) && v._type_ === "primitive";
}

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

function isObject(value: unknown): value is { [key: string]: unknown } {
  return value instanceof Object;
}

function isArray<T>(v: T | T[]): v is T[] {
  return Array.isArray(v);
}

function getField<T extends { [key: string]: unknown }>(
  value: T,
  field: string
): string | undefined {
  if (value.hasOwnProperty(field)) return field;
  return Object.keys(value).find((k) => k.startsWith(field.toString()));
}

/*
 ** If Element definition fits criteria of path return the type [for typechoice].
 ** If Undefined signals it's not compliant (will always return a type if compliant).
 */
function isElementDefinitionWithType(
  element: ElementDefinition,
  path: string,
  expectedType?: string
): code | undefined {
  if (element.path === path) return element.type?.[0].code;
  if (
    element.type &&
    element.type?.length > 1 &&
    path.startsWith(element.path.replace("[x]", ""))
  ) {
    for (let type of element.type) {
      // Because type pulled from typechoice will be capitalized and it may or may not be
      // on the actual type for example HumanName vs boolean
      // Just lowercase both and compare.
      if (type.code.toLocaleLowerCase() === expectedType?.toLocaleLowerCase())
        return type.code;
    }
  }
  return undefined;
}

/*
 ** Given Metainformation and field derive the next metainformation.
 ** This could mean pulling in a new StructureDefinition (IE in case of complex type or resource)
 ** Or setting a new Element index with type.
 */
function deriveNextMetaInformation(
  meta: MetaInformation | undefined,
  field: string,
  expectedType?: string // For Typechoices pass in chunk pulled from field.
): MetaInformation | undefined {
  if (meta?.elementIndex !== undefined) {
    const curElement = meta.sd.snapshot?.element[meta.elementIndex];
    const nextElementPath = `${curElement?.path}.${field.toString()}`;
    let i = meta.elementIndex + 1;
    while (i < (meta.sd.snapshot?.element.length || 0)) {
      const elementToCheck = meta.sd.snapshot?.element[i];
      // Comparison returns the type of the field to element if valid.
      const type =
        elementToCheck &&
        isElementDefinitionWithType(
          elementToCheck,
          nextElementPath,
          expectedType
        );

      if (type) {
        // In this case pull in the SD means it's a complex or resource type
        // so need to retrieve the SD.
        if (isResourceOrComplexType(type)) {
          const sd = meta.getSD && meta.getSD(type);
          if (!sd) throw new Error(`Unknown type found '${type}'`);
          return {
            sd: sd,
            type: type,
            elementIndex: 0,
          };
        }
        return {
          sd: meta.sd,
          type: type,
          elementIndex: i,
        };
      }
      i++;
    }
  }
  return undefined;
}

export function toMetaValueNodes<T>(
  meta: MetaInformation | undefined,
  value: T | T[],
  element?: Element | Element[]
): MetaValueSingular<T> | MetaValueArray<T> | undefined {
  if (isArray(value)) {
    return new MetaValueArray(
      meta,
      value,
      element && isArray(element) ? element : undefined
    );
  }
  if (value === undefined && element === undefined) return undefined;
  return new MetaValueSingular(meta, value, element as Element | undefined);
}

export function descend<T>(
  node: MetaValueSingular<T>,
  field: string
): MetaValue<unknown> | undefined {
  const internalValue = node.internalValue;
  if (isObject(internalValue)) {
    const computedField = getField(internalValue, field);
    if (computedField) {
      let v = internalValue[computedField];
      let extension = internalValue[`_${computedField}`] as
        | Element[]
        | Element
        | undefined;
      const nextMeta = deriveNextMetaInformation(
        node.meta(),
        field,
        computedField.replace(field, "")
      );

      return toMetaValueNodes(nextMeta, v, extension);
    }
  }
  return undefined;
}

export class MetaValueSingular<T> implements MetaValue<T> {
  private _value: T | FHIRPathPrimitive<RawPrimitive>;
  private _meta: MetaInformation | undefined;
  constructor(meta: MetaInformation | undefined, value: T, element?: Element) {
    if (isRawPrimitive(value)) {
      this._value = toFPPrimitive(value, element);
    } else {
      this._value = value;
    }
    this._meta = meta;
  }
  get internalValue() {
    return this._value;
  }
  valueOf(): T {
    if (isFPPrimitive(this._value)) return this._value.value as T;
    return this._value;
  }
  meta(): MetaInformation | undefined {
    return this._meta;
  }
  isArray(): this is MetaValueArray<T> {
    return false;
  }
}

export class MetaValueArray<T> implements MetaValue<Array<T>> {
  private value: Array<MetaValueSingular<T>>;
  private _meta: MetaInformation | undefined;
  constructor(
    meta: MetaInformation | undefined,
    value: Array<T>,
    element?: Element[]
  ) {
    this.value = value.map(
      (v, i: number) =>
        new MetaValueSingular(
          meta,
          v,
          element && isArray(element) ? element[i] : undefined
        )
    );
    this._meta = meta;
  }
  valueOf(): Array<T> {
    return this.value.map((v) => v.valueOf());
  }
  toArray(): Array<MetaValueSingular<T>> {
    return this.value;
  }
  isArray(): this is MetaValueArray<Array<T>> {
    return true;
  }
  meta(): MetaInformation | undefined {
    return this._meta;
  }
}
