import dateParameter from "./date.js";
import numberParameter from "./number.js";
import quantityParameter from "./quantity.js";
import referenceParameter from "./reference.js";
import stringParameter from "./string.js";
import tokenParameter from "./token.js";
import uriParameter from "./uri.js";

export const PARAMETER_FILTERS = {
  token: tokenParameter,
  date: dateParameter,
  uri: uriParameter,
  string: stringParameter,
  number: numberParameter,
  quantity: quantityParameter,
  reference: referenceParameter,
};
