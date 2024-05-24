import { customAlphabet } from "nanoid";

import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";

// [A-Za-z0-9\-\.]{1,64}
// Can't use _ for compliance.
const _generateId = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-",
  22,
);

export function generateId(): id {
  return _generateId() as id;
}
