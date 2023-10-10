import { Resource } from "@iguhealth/fhir-types/r4/types";
import { Operation } from "fast-json-patch";

export interface Mutation {
  path: string;
  op: "add" | "remove" | "replace";
  value?: unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pathFields(path: string) {
  return path.split("/").slice(1);
}

function getValue(value: unknown, json_pointer: string) {
  const fields = pathFields(json_pointer);
  let current_value = value;
  for (const field of fields) {
    if (current_value === undefined) return undefined;
    if (Array.isArray(current_value) && !isNaN(parseInt(field))) {
      current_value = current_value[parseInt(field)];
    } else if (isObject(current_value)) {
      current_value = current_value[field];
    } else {
      return undefined;
    }
  }
  return current_value;
}

function valueExistsAtJsonPointer(value: unknown, json_pointer: string) {
  return getValue(value, json_pointer) !== undefined;
}

function descend(path: string, field: string) {
  return `${path}/${field}`;
}

// (defn- ->next-value
//   "will return either :array or :map for next auto-created type depending on next field."
//   [fields]
//   (cond
//     ;; Map means it's a search for a value if can't find value than utilize the map as the default during building.
//     (map? (first fields))              (first fields)
//     ;; If number means next sequence array
//     (utils/is-number? (second fields)) []
//     ;; Map means filter is being applied so should be array.
//     (map? (second fields))             []
//     (= :- (second fields))            []
//     :else                              {}))

function deriveNextValuePlaceHolder(
  fields: string[]
): Array<unknown> | Record<string, unknown> {
  if (!isNaN(parseInt(fields[1]))) {
    return [];
  }
  return {};
}

function createPatchesNonExistantFields(resource: Resource, path: string) {
  const fields = pathFields(path);
  let patches: Operation[] = [];
  let curValue = resource as unknown;
  let curPointer = "";
  for (let i = 0; i < fields.length; i++) {
    curPointer = descend(curPointer, fields[i]);
    curValue = getValue(curValue, curPointer);
    if (curValue !== undefined) break;
    const nextValue = deriveNextValuePlaceHolder(fields.slice(i));
    patches = [...patches, { op: "add", path: curPointer, value: nextValue }];
  }
  return patches;
}

export default function buildPatches(
  value: Resource,
  op: Mutation
): Operation[] {
  // Builds patches with a given mutation to include non existant values up to the point in the path
  // where the mutation occurs

  switch (op.op) {
    case "remove": {
      if (valueExistsAtJsonPointer(value, op.path)) {
        return [
          {
            op: "remove",
            path: op.path,
          },
        ];
      }
      return [];
    }
    case "add": {
      const patches = createPatchesNonExistantFields(value, op.path);
      //If last is adding value remove here as collection will only add once.
      if (
        patches[patches.length - 1]?.op === "add" &&
        patches[patches.length - 1]?.path === op.path
      ) {
        return [
          ...patches.slice(0, patches.length - 1),
          { op: "add", path: op.path, value: op.value },
        ];
      }
      return [...patches, { op: "add", path: op.path, value: op.value }];
    }
    case "replace": {
      if (op.value === undefined || op.value === null) {
        return buildPatches(value, { op: "remove", path: op.path });
      }
      const patches = createPatchesNonExistantFields(value, op.path);
      return [...patches, { op: "replace", path: op.path, value: op.value }];
    }
    default:
      throw new Error(`Invalid operation '${op.op}'`);
  }
}
