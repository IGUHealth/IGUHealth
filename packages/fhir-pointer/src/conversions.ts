import r4MetaData from "@iguhealth/meta-value/v2/meta/r4";
import r4bMetaData from "@iguhealth/meta-value/v2/meta/r4b";

import { Loc, Parent } from "./types.js";
import { unescapeField } from "./utilities.js";

export function toJSONPointer<T, R, P extends Parent<T>>(loc: Loc<T, R, P>) {
  const indexOfLastSlash = loc.indexOf("/");
  if (indexOfLastSlash === -1) return "";
  return loc.substring(indexOfLastSlash, loc.length);
}

export function toFHIRPath<T, R, P extends Parent<T>>(loc: Loc<T, R, P>) {
  const indexOfLastSlash = loc.indexOf("/");
  if (indexOfLastSlash === -1) return "$this";
  const pieces = loc.substring(indexOfLastSlash + 1).split("/");
  let fp = "$this";
  for (const piece of pieces) {
    const unescapedField = unescapeField(piece);
    const parsedNumber = parseInt(unescapedField);
    if (isNaN(parsedNumber)) {
      fp += `.${unescapedField}`;
    } else {
      fp += `[${parsedNumber}]`;
    }
  }

  return fp;
}
