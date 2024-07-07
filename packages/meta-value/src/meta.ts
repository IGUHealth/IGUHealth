import { complexTypes, resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";

type ElementDefinition = r4.ElementDefinition | r4b.ElementDefinition;
type StructureDefinition = r4.StructureDefinition | r4b.StructureDefinition;
type uri = r4.uri | r4b.uri;

export type TypeMeta = {
  fhirVersion: FHIR_VERSION;
  sd: StructureDefinition;
  elementIndex: number;
  // Typechoice so need to maintain the type here.
  type: uri;
  getSD: <Version extends FHIR_VERSION>(
    fhirVersion: Version,
    type: uri,
  ) => Resource<Version, "StructureDefinition"> | undefined;
};

function isResourceOrComplexType(type: string): boolean {
  return (
    (complexTypes.has(type) || resourceTypes.has(type)) &&
    // Because element and backbone can be used
    // in certain contexts to extend
    // just ignore for now
    type !== "Element" &&
    type !== "BackboneElement"
  );
}

function capitalize(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function resolveContentReferenceIndex(
  sd: StructureDefinition,
  element: ElementDefinition,
): number {
  const contentReference = element.contentReference?.split("#")[1];
  const referenceElementIndex = sd.snapshot?.element.findIndex(
    (element) => element.id === contentReference,
  );
  if (!referenceElementIndex)
    throw new Error(
      "unable to resolve contentreference: '" + element.contentReference + "'",
    );
  return referenceElementIndex;
}

/*
 ** If Element definition fits criteria of path return the type [for typechoice].
 ** If Undefined signals it's not compliant (will always return a type if compliant).
 */
function isElementDefinitionWithType(
  element: ElementDefinition,
  path: string,
  expectedType?: string,
): uri | undefined {
  if (element.path === path) return element.type?.[0].code;
  if (
    element.type &&
    element.type?.length > 1 &&
    path.startsWith(element.path.replace("[x]", ""))
  ) {
    for (const type of element.type) {
      // Because type pulled from typechoice will be capitalized and it may or may not be
      // on the actual type for example HumanName vs boolean
      // Just lowercase both and compare.
      if (type.code.toLocaleLowerCase() === expectedType?.toLocaleLowerCase())
        return type.code;
    }
  }
  return undefined;
}

function searchElementIndexAndType(
  snapshotElements: ElementDefinition[],
  path: string,
  elementIndex: number,
): { index: number; type: string } | undefined {
  for (let i = elementIndex + 1; i < snapshotElements.length; i++) {
    const elementToCheck = snapshotElements[i];
    if (elementToCheck.path === path)
      return { index: i, type: elementToCheck.type?.[0].code as string };
    // Test types on typechoice element.
    if (elementToCheck.type && elementToCheck.type?.length > 1) {
      for (const type of elementToCheck.type) {
        const elementToCheckPath = elementToCheck.path.replace(
          "[x]",
          capitalize(type.code),
        );
        if (path === elementToCheckPath) return { index: i, type: type.code };
      }
    }
  }
  return undefined;
}

/*
 ** Given Metainformation and field derive the next metainformation.
 ** This could mean pulling in a new StructureDefinition (IE in case of complex type or resource)
 ** Or setting a new Element index with type.
 */
export function deriveNextMetaInformation(
  meta: TypeMeta | undefined,
  computedField: string,
): TypeMeta | undefined {
  if (meta?.elementIndex === undefined) return undefined;

  const curElement = meta.sd.snapshot?.element[meta.elementIndex];
  const nextElementPath = `${curElement?.path}.${computedField}`;

  const foundIndexAndType = searchElementIndexAndType(
    meta.sd?.snapshot?.element || [],
    nextElementPath,
    meta.elementIndex,
  );

  if (foundIndexAndType) {
    const { index, type: nextType } = foundIndexAndType;
    const nextElement = meta.sd.snapshot?.element[index];
    if (!nextElement) throw new Error(`No element found on '${index}'`);

    // Handle content references.
    if (nextElement.contentReference) {
      const referenceElementIndex = resolveContentReferenceIndex(
        meta.sd,
        nextElement,
      );
      const referenceElement = meta.sd.snapshot?.element[referenceElementIndex];
      const type = referenceElement?.type?.[0].code;
      if (!type) return undefined;

      return {
        fhirVersion: meta.fhirVersion,
        getSD: meta.getSD,
        sd: meta.sd,
        type,
        elementIndex: referenceElementIndex,
      };
    } else {
      const type = isElementDefinitionWithType(
        nextElement,
        nextElementPath,
        nextType,
      );
      if (!type) return undefined;
      // In this case pull in the SD means it's a complex or resource type
      // so need to retrieve the SD.
      if (isResourceOrComplexType(type)) {
        const sd = meta.getSD?.call(undefined, meta.fhirVersion, type);
        if (!sd) {
          throw new Error(`Could not retrieve sd of type '${type}'`);
        }
        return {
          fhirVersion: meta.fhirVersion,
          getSD: meta.getSD,
          sd: sd,
          type: type,
          elementIndex: 0,
        };
      }

      return {
        fhirVersion: meta.fhirVersion,
        getSD: meta.getSD,
        sd: meta.sd,
        type,
        elementIndex: index,
      };
    }
  }

  return undefined;
}
