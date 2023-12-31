import {
  StructureDefinition,
  ElementDefinition,
} from "@iguhealth/fhir-types/r4/types";
type VisitorFunction<T> = (element: ElementDefinition, children: T[]) => T[];

export function eleIndexToChildIndices(
  elements: Array<ElementDefinition>,
  index?: number
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

function traversalSdElements<T>(
  elements: Array<ElementDefinition>,
  index: number,
  visitorFunction: VisitorFunction<T>
) {
  const childIndices = eleIndexToChildIndices(elements, index);
  const childTraversalValues: any[] = childIndices
    .map((childIndex) => {
      return traversalSdElements(elements, childIndex, visitorFunction);
    })
    .flatMap((x) => x);
  return visitorFunction(elements[index], childTraversalValues);
}

export function traversalBottomUp<T>(
  sd: StructureDefinition,
  visitorFunction: VisitorFunction<T>
) {
  const elements = sd.snapshot?.element;
  if (!elements) throw new Error("StructureDefinition has no elements");
  return traversalSdElements(elements, 0, visitorFunction);
}
