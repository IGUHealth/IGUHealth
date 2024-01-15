import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";

import { Resource, uri } from "@iguhealth/fhir-types/r4/types";
import * as fp from "@iguhealth/fhirpath";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../fhir/context.js";
import {
  toDateRange,
  toQuantityRange,
  toReference,
  toStringParameters,
  toTokenParameters,
} from "../utilities/search/dataConversion.js";
import { SearchParameterResource } from "../utilities/search/parameters.js";

dayjs.extend(isBetween);

interface MemorySearchCTX {
  resolveCanonical: FHIRServerCTX["resolveCanonical"];
  resolveTypeToCanonical: FHIRServerCTX["resolveTypeToCanonical"];
  /*
   ** Used to resolve remote canonicals in the toReference function.
   */
  resolveRemoteCanonical?: Parameters<typeof toReference>[2];
}

async function expressionSearch<CTX extends MemorySearchCTX>(
  ctx: CTX,
  resource: Resource,
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
        type: resource.resourceType as uri,
        getSD: (type) => {
          const canonical = ctx.resolveTypeToCanonical(type);
          if (!canonical)
            throw new OperationError(
              outcomeError(
                "invalid",
                `Could not resolve canonical for type '${type}'.`,
              ),
            );
          return ctx.resolveCanonical("StructureDefinition", canonical);
        },
      },
    },
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
            resourceValue
              .toLowerCase()
              .startsWith(value.toString().toLowerCase())
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
    case "reference": {
      const references = (
        await Promise.all(
          evaluation.map((v) =>
            toReference(
              parameter.searchParameter,
              v,
              ctx.resolveRemoteCanonical,
            ),
          ),
        )
      ).flat();

      for (const value of parameter.value) {
        const pieces = value.toString().split("/");

        if (pieces.length === 1) {
          const foundRef = references.find(
            (r) => r.id === pieces[0] || r.url === pieces[0],
          );
          if (foundRef) return true;
        }
        if (pieces.length === 2) {
          const foundRef = references.find(
            (r) => r.resourceType === pieces[0] && r.id === pieces[1],
          );
          if (foundRef) return true;
        }
      }
      return false;
    }
    case "quantity": {
      const quantityRanges = evaluation.map(toQuantityRange).flat();
      for (const range of quantityRanges) {
        for (const value of parameter.value) {
          const low = range.start.value ? range.start.value : Number.MIN_VALUE;
          const high =
            range.end.value && range.end.value !== "infinite"
              ? range.end.value
              : Number.MAX_VALUE;
          if (value >= low && value <= high) {
            return true;
          }
        }
      }
      return false;
    }
    case "date": {
      const dateRanges = evaluation.map(toDateRange).flat();

      for (const range of dateRanges) {
        for (const value of parameter.value) {
          if (
            dayjs(value).isBetween(range.start, dayjs(range.end), null, "[]")
          ) {
            return true;
          }
        }
      }
      return false;
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
  resource: Resource,
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

export async function fitsSearchCriteria<CTX extends MemorySearchCTX>(
  ctx: CTX,
  resource: Resource,
  parameters: SearchParameterResource[],
) {
  for (const param of parameters) {
    if (!(await checkParameterWithResource(ctx, resource, param))) return false;
  }

  return true;
}
