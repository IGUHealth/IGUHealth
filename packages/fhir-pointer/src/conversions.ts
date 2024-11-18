import { uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllDataTypes,
  Data,
  FHIR_VERSION,
} from "@iguhealth/fhir-types/versions";
import {
  ElementNode,
  MetaNode,
  getMeta,
  getResolvedMeta,
  getStartingMeta,
  resolveTypeNode,
} from "@iguhealth/meta-value/meta";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { pathMeta } from "./index.js";
import { Loc, Parent } from "./types.js";
import { unescapeField } from "./utilities.js";

export function toJSONPointer<T, R, P extends Parent<T>>(loc: Loc<T, R, P>) {
  const indexOfLastSlash = loc.indexOf("/");
  if (indexOfLastSlash === -1) return "";
  return loc.substring(indexOfLastSlash, loc.length);
}

function resolveFieldToTypeChoiceName(
  version: FHIR_VERSION,
  type: uri,
  meta: ElementNode,
  field: string,
): string | undefined {
  const keysToCheck = Object.keys(meta.properties ?? {}).filter((key) => {
    field.startsWith(key);
  });
  for (const key of keysToCheck) {
    const information = getMeta(version, type as uri, meta, key);
    if (information._type_ === "typechoice") {
      const v = Object.keys(information.fields).find((f) => f === field);
      // Return if typechoice includes field name.
      if (v !== undefined) return key;
    }
  }
}

export function toFHIRPath<
  T extends Data<FHIR_VERSION, AllDataTypes>,
  R,
  P extends Parent<T>,
>(loc: Loc<T, R, P>) {
  const indexOfLastSlash = loc.indexOf("/");

  const { version, type } = pathMeta(loc);

  let base = type as uri;
  let meta: ElementNode | undefined = getStartingMeta(version, type as uri);

  if (indexOfLastSlash === -1) return "$this";
  const pieces = loc.substring(indexOfLastSlash + 1).split("/");
  let fp = "$this";

  for (const piece of pieces) {
    const unescapedField = unescapeField(piece);
    const parsedNumber = parseInt(unescapedField);
    let field = unescapedField;

    if (isNaN(parsedNumber)) {
      if (meta?.cardinality !== "single") {
        throw new OperationError(
          outcomeFatal("invalid", "Cannot convert path to FHIRPath", [
            toJSONPointer(loc),
          ]),
        );
      }

      // Resolve typechoice to fp field name.
      // IE valueCoding if typechoice would be just value.
      if (!meta.properties?.[unescapedField]) {
        const typeChoiceField = resolveFieldToTypeChoiceName(
          version,
          base,
          meta,
          unescapedField,
        );
        if (!typeChoiceField) {
          throw new OperationError(
            outcomeFatal("invalid", "Cannot convert path to FHIRPath", [
              toJSONPointer(loc),
            ]),
          );
        }
        field = typeChoiceField;
      }

      const nextMeta = getResolvedMeta(version, base, meta, {}, field);
      if (!nextMeta) {
        throw new OperationError(
          outcomeFatal("invalid", "Cannot convert path to FHIRPath", [
            toJSONPointer(loc),
          ]),
        );
      }

      base = nextMeta.base as uri;
      meta = nextMeta.meta;

      fp += `.${field}`;
    } else {
      if (meta?.cardinality !== "array") {
        throw new OperationError(
          outcomeFatal("invalid", "Cannot convert path to FHIRPath", [
            toJSONPointer(loc),
          ]),
        );
      }

      fp += `[${parsedNumber}]`;

      meta = { ...meta, cardinality: "single" };
    }
  }

  return fp;
}
