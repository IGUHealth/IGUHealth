import {
  ElementDefinition,
  ElementDefinitionType,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";

import { traversalBottomUp } from "../sdTraversal.js";

interface TypeChoiceNode {
  _type_: "typechoice";
  cardinality: "array" | "single";
  types?: Record<string, number>;
}
interface SingularNode {
  _type_: "meta";
  type: uri;
  cardinality: "array" | "single";
  properties?: Record<string, number>;
}
export type MetaNode = SingularNode | TypeChoiceNode;
export interface MetaV2Compiled {
  [key: string]: Array<MetaNode>;
}

function determineIsTypeChoice(element: ElementDefinition): boolean {
  return (element.type ?? []).length > 1;
}

type ElementPath = string & { _elementPathBrand: unknown };
type ElementPathType = string & { _elementPathTypeBrand: unknown };

function combineWithPath(path: ElementPath, type: uri): ElementPathType {
  return `${path}:${type}` as ElementPathType;
}

// Generate indices around the element path and it's type which correlate to location in the meta.
function preGenerateIndices(
  sd: Resource<FHIR_VERSION, "StructureDefinition">,
): Record<ElementPath | ElementPathType, number> {
  let curIndex = 0;
  // Record
  const indices: Record<ElementPath | ElementPathType, number> = {};

  for (let i = 0; i < (sd.snapshot?.element ?? []).length; i++) {
    const element = sd.snapshot?.element[i];
    if (!element) throw new Error("No Element");
    const types = element?.type ?? [];
    indices[element.path as ElementPath] = curIndex++;
    if (determineIsTypeChoice(element)) {
      for (const type of types) {
        indices[combineWithPath(element.path as ElementPath, type.code)] =
          curIndex++;
      }
      indices[element.path as ElementPath] = curIndex++;
    }
  }

  return indices;
}

// function to capaitalize a string
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getElementField(element: ElementDefinition, type?: string) {
  const path = element.path;
  const pathSplit = path.split(".");
  let field = pathSplit[pathSplit.length - 1];
  if (type) {
    field = field.replace("[x]", capitalize(type));
  }
  return field;
}

function createSingularNode(
  element: ElementDefinition,
  type: ElementDefinitionType | undefined,
  children: { index: number; field: string }[],
): MetaNode {
  const node: MetaNode = {
    _type_: "meta",
    type: type?.code as uri,
    cardinality: element.max === "1" ? "single" : "array",
  };

  if (children.length > 0) {
    node.properties = children.reduce((acc: Record<string, number>, k) => {
      acc[k.field] = k.index;
      return acc;
    }, {});
  }

  return node;
}

function createTypeChoiceNode(
  indices: Record<ElementPath | ElementPathType, number>,
  element: ElementDefinition,
): TypeChoiceNode {
  return {
    _type_: "typechoice",
    cardinality: element.max === "1" ? "single" : "array",
    types: (element.type ?? []).reduce((acc: Record<string, number>, type) => {
      acc[type.code] =
        indices[combineWithPath(element.path as ElementPath, type.code)];
      return acc;
    }, {}),
  };
}

function SDToMetaData(sd: Resource<FHIR_VERSION, "StructureDefinition">) {
  const indices = preGenerateIndices(sd);
  const metaInfo: Array<MetaNode> = [
    ...new Array(Math.max(...Object.values(indices))),
  ];

  traversalBottomUp<{ index: number; field: string }>(
    sd,
    (element: ElementDefinition, children) => {
      if (element.contentReference) {
        const index =
          indices[
            element.contentReference.substring(1) as unknown as ElementPath
          ];
        return [
          {
            index,
            field: getElementField(element),
          },
        ];
      }

      if (determineIsTypeChoice(element)) {
        for (const type of element.type ?? []) {
          const indexKey = combineWithPath(
            element.path as ElementPath,
            type.code,
          );

          const index = indices[indexKey];
          metaInfo[index] = createSingularNode(element, type, children);
        }
        metaInfo[indices[element.path as ElementPath]] = createTypeChoiceNode(
          indices,
          element,
        );

        return [
          ...(element.type ?? []).map((type) => {
            const indexKey = combineWithPath(
              element.path as ElementPath,
              type.code,
            );

            const index = indices[indexKey];
            return {
              index,
              field: getElementField(element, type.code),
            };
          }),
          {
            index: indices[element.path as ElementPath],
            field: getElementField(element),
          },
        ];
        // For Type choices include a typechoice node which points to the types loc.
      } else {
        const index = indices[element.path as ElementPath];
        metaInfo[index] = createSingularNode(
          element,
          element.type?.[0] as ElementDefinitionType,
          children,
        );

        return [
          {
            index: indices[element.path as ElementPath],
            field: getElementField(element),
          },
        ];
      }
    },
  );

  return metaInfo;
}

export function generateMetaData<Version extends FHIR_VERSION>(
  sds: Resource<Version, "StructureDefinition">[],
): MetaV2Compiled {
  return sds.reduce((acc: MetaV2Compiled, sd) => {
    acc[sd.type] = SDToMetaData(sd);
    return acc;
  }, {} as MetaV2Compiled);
}
