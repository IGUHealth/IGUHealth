import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";

import { Resource, uri } from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import * as fp from "@iguhealth/fhirpath";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../fhir-context/types.js";
import dataConversion, {
  ResolveRemoteCanonical,
  SEARCH_TYPE,
} from "../../utilities/search/dataConversion.js";
import { SearchParameterResource } from "../../utilities/search/parameters.js";
import fitsCriteria from "./search/fitsCriteria.js";

dayjs.extend(isBetween);

interface MemorySearchCTX {
  resolveCanonical: FHIRServerCTX["resolveCanonical"];
  resolveTypeToCanonical: FHIRServerCTX["resolveTypeToCanonical"];
  /*
   ** Used to resolve remote canonicals in the toReference function.
   */
  resolveRemoteCanonical?: ResolveRemoteCanonical;
}

async function expressionSearch<CTX extends MemorySearchCTX>(
  ctx: CTX,
  fhirVersion: FHIR_VERSION,
  resource: Resource | r4b.Resource,
  parameter: SearchParameterResource,
) {
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

  const evaluation = fp.evaluateWithMeta(
    parameter.searchParameter.expression,
    resource,
    {
      meta: {
        fhirVersion,
        type: resource.resourceType as uri,
        getSD: <Version extends FHIR_VERSION>(
          fhirVersion: Version,
          type: uri,
        ) => {
          const canonical = ctx.resolveTypeToCanonical(fhirVersion, type);
          if (!canonical)
            throw new OperationError(
              outcomeError(
                "invalid",
                `Could not resolve canonical for type '${type}'.`,
              ),
            );
          return ctx.resolveCanonical(
            fhirVersion,
            "StructureDefinition",
            canonical,
          );
        },
      },
    },
  );
  const searchType = parameter.searchParameter.type as SEARCH_TYPE;
  const data = await dataConversion(
    parameter.searchParameter,
    searchType,
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
  }
}

function checkParameterWithResource<CTX extends MemorySearchCTX>(
  ctx: CTX,
  fhirVersion: FHIR_VERSION,
  resource: Resource | r4b.Resource,
  parameter: SearchParameterResource,
) {
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

export async function fitsSearchCriteria<CTX extends MemorySearchCTX>(
  ctx: CTX,
  fhirVersion: FHIR_VERSION,
  resource: Resource | r4b.Resource,
  parameters: SearchParameterResource[],
) {
  for (const param of parameters) {
    if (!(await checkParameterWithResource(ctx, fhirVersion, resource, param)))
      return false;
  }

  return true;
}
