import { ElementDefinition } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

/**
 * Removes the type from the path.
 * @param path The ElementDefinition path to remove the type from.
 */
export function removeTypeOnPath(path: string): string {
  return path.substring(path.indexOf(".") + 1);
}

export type Discriminator = NonNullable<
  NonNullable<ElementDefinition["slicing"]>["discriminator"]
>[number];

/**
 *
 * @param discriminator the discrimator to convert to an ElementDefinition path.
 * @returns the path of the discriminator as an ElementDefinition path.
 */
export function convertPathToElementPointer(
  discriminatorElement: ElementDefinition,
  discriminator: Discriminator,
): string {
  if (
    discriminator.path.includes("ofType(") ||
    discriminator.path.includes("resolve()") ||
    discriminator.path.includes("extension(")
  ) {
    throw new OperationError(
      outcomeFatal(
        "not-supported",
        `Discriminator path '${discriminator.path}' is not supported`,
      ),
    );
  }

  return `${removeTypeOnPath(discriminatorElement.path)}.${discriminator.path.replace("$this", "")}`;
}
