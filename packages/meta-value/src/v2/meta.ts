/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ElementNode,
  MetaNode,
  MetaV2Compiled,
} from "@iguhealth/codegen/generate/meta-data";
import _r4Meta from "./generated/r4.json" with { type: "json" };
import _r4bMeta from "./generated/r4b.json" with { type: "json" };
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";
import { uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIRPathPrimitive as FHIRPrimitive,
  RawPrimitive,
  isObject,
} from "../utilities.js";

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

export function getStartingMeta(
  fhirVersion: FHIR_VERSION,
  type: uri,
): ElementNode | undefined {
  return getGlobalMeta(fhirVersion)[type]?.[0] as ElementNode | undefined;
}

export function getMeta<T>(
  fhirVersion: FHIR_VERSION,
  base: string,
  meta: ElementNode,
  value: T | FHIRPrimitive<RawPrimitive>,
  field: string,
): { base: string; meta: ElementNode; field: string } | undefined {
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
