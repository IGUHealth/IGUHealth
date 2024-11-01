import { eleIndexToChildIndices } from "@iguhealth/codegen/traversal/structure-definition";
import { ElementDefinition } from "@iguhealth/fhir-types/lib/generated/r4/types";

function isSliced(element: ElementDefinition) {
  return element.slicing !== undefined;
}

type SliceIndex = {
  discriminator: number;
  elements: number[];
};

/**
 * Filter elements for discriminator slice + slicing elements.
 * @param elements
 */
export function getSliceIndices(
  elements: ElementDefinition[],
  index: number,
): SliceIndex[] {
  const children = eleIndexToChildIndices(elements, index);

  const slices: SliceIndex[] = [];

  let i = 0;
  while (i < children.length) {
    const childIndex = children[i++];
    if (isSliced(elements[childIndex])) {
      const discriminatorIndex = childIndex;
      const sliceIndexes = [];

      while (i < children.length && elements[children[i]].sliceName) {
        sliceIndexes.push(children[i]);
        i++;
      }
      slices.push({
        discriminator: discriminatorIndex,
        elements: sliceIndexes,
      });
    }
  }

  return slices;
}
