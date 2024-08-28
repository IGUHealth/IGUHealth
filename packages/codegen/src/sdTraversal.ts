import { ElementDefinition } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";

type VisitorFunction<T> = (
  element: ElementDefinition,
  children: T[],
  info: { curIndex: number },
) => T[];

export function eleIndexToChildIndices(
  elements: Array<ElementDefinition>,
  index?: number,
): Array<number> {
  if (index === undefined) {
    return eleIndexToChildIndices(elements, 0);
  } else {
    const parent = elements[index];
    const parentPath = parent.path;
    const parentPathEscaped = parentPath.replace(/\./g, "\\."); // Escape periods
    const childRegex = new RegExp("^" + parentPathEscaped + "\\." + "[^\\.]+$");
    let curIndex = index + 1;
    const childrenIndices: number[] = [];
    while (curIndex < elements.length) {
      if (elements[curIndex].path.match(childRegex)) {
        childrenIndices.push(curIndex);
      }
      curIndex++;
    }
    return childrenIndices;
  }
}

function traversalBottomUpSdElements<T>(
  elements: Array<ElementDefinition>,
  index: number,
  visitorFunction: VisitorFunction<T>,
) {
  const childIndices = eleIndexToChildIndices(elements, index);
  const childTraversalValues: any[] = childIndices
    .map((childIndex) => {
      return traversalBottomUpSdElements(elements, childIndex, visitorFunction);
    })
    .flatMap((x) => x);
  return visitorFunction(elements[index], childTraversalValues, {
    curIndex: index,
  });
}

export function traversalBottomUp<T>(
  sd: Resource<FHIR_VERSION, "StructureDefinition">,
  visitorFunction: VisitorFunction<T>,
) {
  const elements = sd.snapshot?.element;
  if (!elements) throw new Error("StructureDefinition has no elements");
  return traversalBottomUpSdElements(elements, 0, visitorFunction);
}
