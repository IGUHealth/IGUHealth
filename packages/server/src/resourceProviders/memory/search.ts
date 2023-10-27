import { Resource } from "@iguhealth/fhir-types/r4/types";
import { SearchParameterResource } from "../utilities/search/parameters.js";
import * as fp from "@iguhealth/fhirpath";

function checkParameterWithResource(
  resource: Resource,
  parameter: SearchParameterResource
) {
  switch (parameter.name) {
    // Special handling for performance reason on heavily used parameters
    case "url": {
      return (
        (resource as unknown as Record<string, unknown>)["url"] ===
        parameter.value[0]
      );
    }
    case "name": {
      // Because SearchParameter.name is heavily used using a special case here to avoid
      // performance degredation.
      if (resource.resourceType === "SearchParameter") {
        console.log("HIT");
        return (
          (resource as unknown as Record<string, unknown>)["name"] ===
          parameter.value[0]
        );
      }
    }
    default: {
      if (parameter.searchParameter.expression) {
        const evaluation = fp.evaluateWithMeta(
          parameter.searchParameter.expression,
          resource
        );
        return (
          evaluation.find((v) => {
            const value = v.valueOf();
            if (typeof value === "number" || typeof value === "string")
              return parameter.value.includes(value);
            return false;
          }) !== undefined
        );
      }
      return false;
    }
  }
}

export async function fitsSearchCriteria(
  resource: Resource,
  parameters: SearchParameterResource[]
) {
  for (const param of parameters) {
    if (!checkParameterWithResource(resource, param)) return false;
  }

  return true;
}
