import { SearchParameterResource } from "@iguhealth/client/lib/url";
import { uri } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import * as fhirpath from "@iguhealth/fhirpath";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import dataConversion, {
  ResolveCanonical,
  SEARCH_TYPE,
} from "../../../search-stores/dataConversion.js";
import fitsCriteria from "./search/fitsCriteria.js";

interface MemorySearchCTX {
  resolveCanonical: IGUHealthServerCTX["resolveCanonical"];
  /*
   ** Used to resolve remote canonicals in the toReference function.
   */
  resolveRemoteCanonical?: ResolveCanonical;
}

async function expressionSearch<
  CTX extends MemorySearchCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
  parameter: SearchParameterResource<Version>,
): Promise<boolean> {
  if (!parameter.searchParameter.expression)
    throw new OperationError(
      outcomeError(
        "invalid",
        `Parameter '${parameter.name}' did not have an expression associated with it.`,
      ),
    );
  if (parameter.chainedParameters)
    throw new OperationError(
      outcomeError(
        "not-supported",
        "Chained parameters are not supported in memory search.",
      ),
    );

  if (parameter.modifier)
    throw new OperationError(
      outcomeError(
        "not-supported",
        "Modifiers are not supported in memory search.",
      ),
    );

  const evaluation = await fhirpath.evaluateWithMeta(
    parameter.searchParameter.expression,
    resource,
    {
      fhirVersion,
      type: resource.resourceType as uri,
    },
  );
  const searchType = parameter.searchParameter.type as SEARCH_TYPE;
  const data = await dataConversion(
    fhirVersion,
    parameter.searchParameter,
    evaluation,
    ctx.resolveRemoteCanonical,
  );

  switch (parameter.searchParameter.type) {
    case "string":
    case "number":
    case "token":
    case "uri":
    case "quantity":
    case "date":
    case "reference": {
      return data.some((v) => fitsCriteria(searchType, v, parameter.value));
    }

    case "composite":
    case "special": {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Memory search does not support '${parameter.searchParameter.type}' yet.`,
        ),
      );
    }
    default: {
      return false;
    }
  }
}

async function checkParameterWithResource<
  CTX extends MemorySearchCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
  parameter: SearchParameterResource<Version>,
): Promise<boolean> {
  switch (parameter.name) {
    // Special handling for performance reason on heavily used parameters
    case "url": {
      return (
        (resource as unknown as Record<string, unknown>)["url"] ===
        parameter.value[0]
      );
    }
    default: {
      if (
        parameter.name === "code" &&
        resource.resourceType === "SearchParameter"
      ) {
        return (
          (resource as unknown as Record<string, unknown>)["code"] ===
          parameter.value[0]
        );
      }
      return expressionSearch(ctx, fhirVersion, resource, parameter);
    }
  }
}

export async function fitsSearchCriteria<
  CTX extends MemorySearchCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
  parameters: SearchParameterResource<Version>[],
) {
  for (const param of parameters) {
    if (!(await checkParameterWithResource(ctx, fhirVersion, resource, param)))
      return false;
  }

  return true;
}
