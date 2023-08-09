import { ResourceType, SearchParameter } from "@iguhealth/fhir-types";
import { param_types_supported } from "./constants.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

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

export function searchParameterToTableName(searchParameter: SearchParameter) {
  if (param_types_supported.includes(searchParameter.type)) {
    return `${searchParameter.type}_idx`;
  }
  throw new OperationError(
    outcomeError(
      "not-supported",
      `Search Parameter of type '${searchParameter.type}' is not supported`
    )
  );
}
