import { isObject } from "@iguhealth/meta-value/utilities";

/**
 * If primitive: it must match exactly the pattern value
 * If a complex object: it must match (recursively) the pattern value
 * If an array: it must match (recursively) the pattern value.
 * @param pattern
 * @param value
 */
export function conformsToPattern(pattern: unknown, value: unknown): boolean {
  if (isObject(pattern)) {
    if (!isObject(value)) return false;
    if (Array.isArray(pattern)) {
      if (!Array.isArray(value)) return false;
      for (let i = 0; i < pattern.length; i++) {
        const valueExists = value.filter((v) =>
          conformsToPattern(pattern[i], v),
        );
        // Per spec as long as a single value matches in the pattern then it's truthy
        if (valueExists.length === 0) return false;
      }
      return true;
    } else {
      const patternKeys = Object.keys(pattern);
      for (const key of patternKeys) {
        if (!conformsToPattern(pattern[key], value[key])) return false;
      }
      return true;
    }
  } else {
    return pattern === value;
  }
}
