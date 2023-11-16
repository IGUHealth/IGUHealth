import {
  StructureDefinition,
  Element,
  ElementDefinition,
  code,
} from "@iguhealth/fhir-types/r4/types";
import { complexTypes, resourceTypes } from "@iguhealth/fhir-types/r4/sets";

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

function resolveContentReferenceIndex(
  sd: StructureDefinition,
  element: ElementDefinition
): number {
  const contentReference = element.contentReference?.split("#")[1];
  const referenceElementIndex = sd.snapshot?.element.findIndex(
    (element) => element.id === contentReference
  );
  if (!referenceElementIndex)
    throw new Error(
      "unable to resolve contentreference: '" + element.contentReference + "'"
    );
  return referenceElementIndex;
}

type Location = (string | number)[];

type TypeMeta = {
  sd: StructureDefinition;
  elementIndex: number;
  // Typechoice so need to maintain the type here.
  type: string;
  getSD?: (type: code) => StructureDefinition | undefined;
};

export type Meta = { location: Location; type: TypeMeta | undefined };
export type PartialTypeMeta = Partial<TypeMeta>;
export type PartialMeta = { location?: Location; type?: Partial<TypeMeta> };

export interface MetaValue<T> {
  meta(): TypeMeta | undefined;
  valueOf(): T;
  isArray(): this is MetaValueArray<T>;
  location(): Location | undefined;
}

type RawPrimitive = string | number | boolean | undefined;
type FHIRPathPrimitive<T extends RawPrimitive> = Element & {
  _type_: "primitive";
  value: T;
};

function deriveNextTypeMeta(
  partialMeta: PartialTypeMeta | undefined
): TypeMeta | undefined {
  if (!partialMeta) return partialMeta;
  if (!partialMeta.elementIndex) partialMeta.elementIndex = 0;
  if (!partialMeta.sd && partialMeta.type)
    partialMeta.sd = partialMeta.getSD && partialMeta.getSD(partialMeta.type);

  return partialMeta.sd ? (partialMeta as TypeMeta) : undefined;
}

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
  return value !== null && typeof value === "object";
}

function isArray<T>(v: T | T[]): v is T[] {
  return Array.isArray(v);
}

function getField<T extends { [key: string]: unknown }>(
  value: T,
  field: string
): string | undefined {
  if (value.hasOwnProperty(field)) return field;
  const foundField = Object.keys(value).find(
    (k) =>
      k.startsWith(field.toString()) || k.startsWith(`_${field.toString()}`)
  );

  return foundField?.startsWith("_") ? foundField.substring(1) : foundField;
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

function capitalize(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function searchElementIndexAndType(
  snapshotElements: ElementDefinition[],
  path: string,
  elementIndex: number
): { index: number; type: string } | undefined {
  for (let i = elementIndex + 1; i < snapshotElements.length; i++) {
    const elementToCheck = snapshotElements[i];
    if (elementToCheck.path === path)
      return { index: i, type: elementToCheck.type?.[0].code as string };
    // Test types on typechoice element.
    if (elementToCheck.type && elementToCheck.type?.length > 1) {
      for (const type of elementToCheck.type) {
        const elementToCheckPath = elementToCheck.path.replace(
          "[x]",
          capitalize(type.code)
        );
        if (path === elementToCheckPath) return { index: i, type: type.code };
      }
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
  meta: TypeMeta | undefined,
  computedField: string
): TypeMeta | undefined {
  if (meta?.elementIndex === undefined) return undefined;

  const curElement = meta.sd.snapshot?.element[meta.elementIndex];
  const nextElementPath = `${curElement?.path}.${computedField}`;

  const foundIndexAndType = searchElementIndexAndType(
    meta.sd?.snapshot?.element || [],
    nextElementPath,
    meta.elementIndex
  );

  if (foundIndexAndType) {
    const { index, type: nextType } = foundIndexAndType;
    const nextElement = meta.sd.snapshot?.element[index] as ElementDefinition;

    const nextMeta: PartialTypeMeta = {
      getSD: meta.getSD,
    };

    // Handle content references.
    if (nextElement.contentReference) {
      const referenceElementIndex = resolveContentReferenceIndex(
        meta.sd,
        nextElement
      );
      const referenceElement = meta.sd.snapshot?.element[referenceElementIndex];
      const type = referenceElement?.type?.[0].code;
      if (!type) return undefined;

      return {
        ...nextMeta,
        sd: meta.sd,
        type,
        elementIndex: referenceElementIndex,
      };
    } else {
      const type = isElementDefinitionWithType(
        nextElement,
        nextElementPath,
        nextType
      );
      if (!type) return undefined;
      // In this case pull in the SD means it's a complex or resource type
      // so need to retrieve the SD.
      if (isResourceOrComplexType(type)) {
        const sd = meta.getSD && meta.getSD(type);
        if (!sd) {
          throw new Error(`Could not retrieve sd of type '${type}'`);
        }
        return {
          ...nextMeta,
          sd: sd,
          type: type,
          elementIndex: 0,
        };
      }

      return {
        ...nextMeta,
        sd: meta.sd,
        type,
        elementIndex: index,
      };
    }
  }

  return undefined;
}

export function toMetaValueNodes<T>(
  meta: PartialMeta,
  value: T | T[],
  element?: Element | Element[]
): MetaValueSingular<T> | MetaValueArray<T> | undefined {
  if (value instanceof MetaValueArray || value instanceof MetaValueSingular)
    return value;
  if (isArray(value)) {
    return new MetaValueArray(
      meta,
      value,
      element && isArray(element) ? element : undefined
    );
  }
  if (value === undefined && element === undefined) return undefined;
  // Assign a type automatically if the value is a resourceType
  if (isObject(value) && typeof value.resourceType === "string")
    meta = {
      ...meta,
      type: meta.type ? { ...meta.type, type: value.resourceType } : undefined,
    };
  return new MetaValueSingular(meta, value, element as Element | undefined);
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

export function descend<T>(
  node: MetaValueSingular<T>,
  field: string
): MetaValue<unknown> | undefined {
  const internalValue = node.internalValue;
  if (isObject(internalValue)) {
    const computedField = getField(internalValue, field);
    if (computedField) {
      let v = internalValue[computedField];
      let elementValue = internalValue[`_${computedField}`] as
        | Element[]
        | Element
        | undefined;
      const nextMeta = {
        location: descendLoc(node, computedField),
        type: deriveNextMetaInformation(node.meta(), computedField),
      };

      return toMetaValueNodes(nextMeta, v, elementValue);
    }
  }
  return undefined;
}

export class MetaValueSingular<T> implements MetaValue<T> {
  private _value: T | FHIRPathPrimitive<RawPrimitive>;
  private _meta: Meta;
  constructor(meta: PartialMeta, value: T, element?: Element) {
    if (isRawPrimitive(value) || element !== undefined) {
      this._value = toFPPrimitive(
        isRawPrimitive(value) ? value : undefined,
        element
      );
    } else {
      this._value = value;
    }
    this._meta = {
      location: meta.location ? meta.location : [],
      type: deriveNextTypeMeta(meta.type),
    };
  }
  get internalValue() {
    return this._value;
  }
  valueOf(): T {
    if (isFPPrimitive(this._value)) return this._value.value as T;
    return this._value;
  }
  meta(): TypeMeta | undefined {
    return this._meta.type;
  }
  isArray(): this is MetaValueArray<T> {
    return false;
  }
  location(): Location {
    return this._meta.location;
  }
}

export class MetaValueArray<T> implements MetaValue<Array<T>> {
  private value: Array<MetaValueSingular<T>>;
  private _meta: Meta;
  constructor(meta: PartialMeta, value: Array<T>, element?: Element[]) {
    this.value = value.map((v, i: number) => {
      if (v instanceof MetaValueSingular) return v;
      return new MetaValueSingular(
        {
          ...meta,
          location: meta?.location ? [...meta.location, i] : [],
        },
        v,
        element ? element[i] : undefined
      );
    });
    this._meta = {
      location: meta.location ? meta.location : [],
      type: deriveNextTypeMeta(meta.type),
    };
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
  meta(): TypeMeta | undefined {
    return this._meta.type;
  }
  location(): Location {
    return this._meta.location;
  }
}
