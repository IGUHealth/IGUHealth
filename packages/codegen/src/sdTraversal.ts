import { StructureDefinition, ElementDefinition } from "./typeGeneration";
type VisitorFunction = (element: ElementDefinition, children: any[][]) => any;

function eleIndexToChildIndices(
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
    const childrenIndices = [];
    while (curIndex < elements.length) {
      if (elements[curIndex].path.match(childRegex)) {
        childrenIndices.push(curIndex);
      }
      curIndex++;
    }
    return childrenIndices;
  }
}

function traversalSdElements(
  elements: Array<ElementDefinition>,
  index: number,
  visitorFunction: VisitorFunction
) {
  const childIndices = eleIndexToChildIndices(elements, index);
  const childTraversalValues: any[] = childIndices
    .map((childIndex) => {
      return traversalSdElements(elements, childIndex, visitorFunction);
    })
    .flatMap((x) => x);
  return visitorFunction(elements[index], childTraversalValues);
}

export function traversalBottomUp(
  sd: StructureDefinition,
  visitorFunction: VisitorFunction
) {
  const elements = sd.snapshot.element;
  return traversalSdElements(elements, 0, visitorFunction);
}
