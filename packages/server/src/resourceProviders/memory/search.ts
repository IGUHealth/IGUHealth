import { Resource, StructureDefinition } from "@iguhealth/fhir-types/r4/types";
import { SearchParameterResource } from "../utilities/search/parameters.js";
import * as fp from "@iguhealth/fhirpath";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import {
  toReference,
  toDateRange,
  toStringParameters,
  toTokenParameters,
} from "../utilities/search/dataConversion.js";
import { AsyncMemoryCTX } from "./types.js";

async function expressionSearch(
  ctx: AsyncMemoryCTX,
  resource: Resource,
  parameter: SearchParameterResource
) {
  if (!parameter.searchParameter.expression)
    throw new OperationError(
      outcomeError(
        "invalid",
        `Parameter '${parameter.name}' did not have an expression associated with it.`
      )
    );
  if (parameter.chainedParameters)
    throw new OperationError(
      outcomeError(
        "not-supported",
        "Chained parameters are not supported in memory search."
      )
    );

  if (parameter.modifier)
    throw new OperationError(
      outcomeError(
        "not-supported",
        "Modifiers are not supported in memory search."
      )
    );

  const evaluation = fp.evaluateWithMeta(
    parameter.searchParameter.expression,
    resource,
    {
      meta: {
        type: resource.resourceType,
        getSD: (type) => ctx.resolveSD(type),
      },
    }
  );
  switch (parameter.searchParameter.type) {
    case "number": {
      for (const metaValue of evaluation) {
        const value = metaValue.valueOf();
        if (value === "number" && parameter.value.includes(value)) return true;
      }
      return false;
    }
    case "string": {
      for (const resourceValue of evaluation.map(toStringParameters).flat()) {
        for (const value of parameter.value) {
          if (
            value
              .toString()
              .toLowerCase()
              .startsWith(resourceValue.toLowerCase())
          ) {
            return true;
          }
        }
      }
      return false;
    }
    case "token": {
      for (const tokenValue of evaluation
        .map((v) => toTokenParameters(parameter.searchParameter, v))
        .flat()) {
        if (tokenValue.code && parameter.value.includes(tokenValue.code))
          return true;
      }

      return false;
    }
    case "uri": {
      for (const stringValue of evaluation.map(toStringParameters).flat()) {
        if (parameter.value.includes(stringValue)) return true;
      }
      return false;
    }
    // case "reference": {
    //   const references = await Promise.all(
    //     evaluation.map((v) => toReference(ctx, parameter.searchParameter, v))
    //   );
    // }
    case "reference":
    case "date":
    case "composite":
    case "special": {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Memory search does not support '${parameter.searchParameter.type}' yet.`
        )
      );
    }
  }
}

function checkParameterWithResource(
  ctx: AsyncMemoryCTX,
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
    default: {
      if (
        parameter.name === "name" &&
        resource.resourceType === "SearchParameter"
      ) {
        return (
          (resource as unknown as Record<string, unknown>)["name"] ===
          parameter.value[0]
        );
      }
      return expressionSearch(ctx, resource, parameter);
    }
  }
}

export async function fitsSearchCriteria(
  ctx: AsyncMemoryCTX,
  resource: Resource,
  parameters: SearchParameterResource[]
) {
  for (const param of parameters) {
    if (!(await checkParameterWithResource(ctx, resource, param))) return false;
  }

  return true;
}
