import { ResourceType } from "@iguhealth/fhir-types";

export function searchResources(
  resourceTypes: ResourceType[]
): (ResourceType | string)[] {
  const searchTypes = ["Resource", "DomainResource"];
  if (resourceTypes.length > 0) {
    return searchTypes.concat(resourceTypes);
  }
  return searchTypes;
}

export function getDecimalPrecision(value: number): number {
  const decimalPrecision = value.toString().split(".")[1]?.length || 0;
  return decimalPrecision;
}
