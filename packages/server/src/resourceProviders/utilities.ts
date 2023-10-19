import pg from "pg";

import {
  Resource,
  BundleEntry,
  ResourceType,
  SearchParameter,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/types";

import { fhirResponseToKoaResponse } from "../koaParsing/index.js";
import { FHIRServerCTX } from "../fhirServer.js";
import { param_types_supported } from "./postgres/constants.js";
import { ParsedParameter } from "@iguhealth/client/url";

export type SearchParameterResource = ParsedParameter<string | number> & {
  type: "resource";
  searchParameter: SearchParameter;
  chainedParameters?: SearchParameter[][];
};

export type SearchParameterResult = ParsedParameter<string | number> & {
  type: "result";
};

export type ParameterType = SearchParameterResource | SearchParameterResult;

export function deriveLimit(
  range: [number, number],
  userLimit?: ParsedParameter<string | number>
): number {
  const limit =
    userLimit &&
    !isNaN(parseInt((userLimit.value && userLimit.value[0]).toString()))
      ? Math.min(
          Math.max(
            parseInt((userLimit.value && userLimit.value[0]).toString()),
            range[0]
          ),
          range[1]
        )
      : range[1];

  return limit;
}

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

export function searchParameterToTableName(
  searchparameter_type: SearchParameter["type"]
) {
  if (param_types_supported.includes(searchparameter_type)) {
    return `${searchparameter_type}_idx`;
  }
  throw new OperationError(
    outcomeError(
      "not-supported",
      `Search Parameter of type '${searchparameter_type}' is not supported`
    )
  );
}

// Returns the resourceType from request on type level else uses the _type parameter or empty specifying no filter on specific resource.
function _deriveResourceTypeFilter(request: FHIRRequest): string[] {
  switch (request.type) {
    case "search-request": {
      if (request.level === "type")
        return [request.resourceType as ResourceType];
      const _typeParameter = request.parameters.find((p) => p.name === "_type");
      if (_typeParameter) return _typeParameter.value as ResourceType[];
      return [];
    }
    default:
      return "resourceType" in request
        ? [request.resourceType as ResourceType]
        : [];
  }
}

export function deriveResourceTypeFilter(request: FHIRRequest): ResourceType[] {
  const passedinTypes = _deriveResourceTypeFilter(request) as ResourceType[];
  for (const type of passedinTypes) {
    if (!resourceTypes.has(type)) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Resource Type '${type}' is not supported`
        )
      );
    }
  }
  return passedinTypes;
}

/*
 * Returns resourceTypes to perform a search which involves concating
 * Given type with heirarchy of inherited types (DomainResource, Resource)
 */
export function typesToSearch(
  resourceTypes: ResourceType[]
): (ResourceType | string)[] {
  const searchTypes = ["Resource", "DomainResource"];
  if (resourceTypes.length > 0) {
    return searchTypes.concat(resourceTypes);
  }
  return searchTypes;
}

async function associateChainedParameters(
  parsedParameter: SearchParameterResource,
  resolveSearchParameter: (
    resourceTypes: ResourceType[],
    name: string
  ) => Promise<SearchParameter[]>
): Promise<SearchParameterResource> {
  if (!parsedParameter.chains) return parsedParameter;

  // All middle chains should be references.
  let last = [parsedParameter.searchParameter];
  const chainedParameters: SearchParameter[][] = [];

  for (const chain of parsedParameter.chains) {
    const targets = last
      .map((l) => {
        if (l.type !== "reference")
          throw new OperationError(
            outcomeError(
              "invalid",
              `SearchParameter with name '${l.name}' is not a reference.`
            )
          );
        return l.target || [];
      })
      .flat();

    const chainParameter = await resolveSearchParameter(
      targets as ResourceType[],
      chain
    );

    if (chainParameter.length === 0)
      throw new OperationError(
        outcomeError(
          "not-found",
          `SearchParameter with name '${chain}' not found in chain.`
        )
      );
    last = chainParameter;
    chainedParameters.push(chainParameter);
  }

  return {
    ...parsedParameter,
    chainedParameters,
  };
}

export function isSearchResultParameter(
  parameter: ParsedParameter<string | number>
) {
  // List pulled from https://hl7.org/fhir/r4/search.htm
  // These parameters do not have associated search parameter and instead require hard logic.
  /* eslint-disable no-fallthrough */
  switch (parameter.name) {
    case "_count":
    // _offset not in param results so adding here.
    case "_offset":
    case "_total":
    case "_sort":
      return true;
    case "_include":
    case "_revinclude":
    case "_summary":
    case "_elements":
    case "_contained":
    case "_containedType": {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameter of type '${parameter.name}' is not yet supported.`
        )
      );
    }
    default:
      return false;
  }
}

export async function findSearchParameter<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resourceTypes: ResourceType[],
  name: string
): Promise<{ total?: number; resources: SearchParameter[] }> {
  const result = await ctx.client.search_type(ctx, "SearchParameter", [
    { name: "name", value: [name] },
    {
      name: "type",
      value: param_types_supported,
    },
    {
      name: "base",
      value: searchResources(resourceTypes),
    },
  ]);

  return result;
}

export async function parametersWithMetaAssociated(
  resourceTypes: ResourceType[],
  parameters: ParsedParameter<string | number>[],
  resolveSearchParameter: (
    resourceTypes: ResourceType[],
    name: string
  ) => Promise<SearchParameter[]>
): Promise<ParameterType[]> {
  const result = await Promise.all(
    parameters.map(async (p) => {
      if (isSearchResultParameter(p)) {
        const param: SearchParameterResult = { ...p, type: "result" };
        return param;
      }

      const searchParameterSearchResult = await resolveSearchParameter(
        resourceTypes,
        p.name
      );

      if (searchParameterSearchResult.length === 0) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `SearchParameter with name '${
              p.name
            }' not found for types '${resourceTypes.join(", ")}'.`
          )
        );
      }

      if (searchParameterSearchResult.length > 1)
        throw new OperationError(
          outcomeError(
            "invalid",
            `SearchParameter with name '${p.name}' found multiple parameters.`
          )
        );

      const searchParameter = searchParameterSearchResult[0];
      const param: SearchParameterResource = {
        ...p,
        type: "resource",
        searchParameter: searchParameter,
      };
      return associateChainedParameters(param, resolveSearchParameter);
    })
  );

  return result;
}

export function fhirResponseToBundleEntry(
  fhirResponse: FHIRResponse
): BundleEntry {
  const koaResponse = fhirResponseToKoaResponse(fhirResponse);

  return {
    response: {
      status: koaResponse.status ? koaResponse.status?.toString() : "200",
      location: (koaResponse.headers?.Location ||
        koaResponse.headers?.["Content-Location"]) as string | undefined,
    },
    resource: koaResponse.body ? (koaResponse.body as Resource) : undefined,
  };
}

async function retryFailedTransactions<ReturnType>(
  numberOfRetries: number,
  execute: () => Promise<ReturnType>
): Promise<ReturnType> {
  for (let i = 0; i < numberOfRetries; i++) {
    console.log("retry :", i);
    try {
      const res = await execute();
      return res;
    } catch (e) {
      if (!(e instanceof pg.DatabaseError)) {
        console.error("THROWING", e);
        throw e;
      }
      // Only going to retry on failed transactions
      console.log("caught ERROR:", e.code);
      if (e.code !== "40001") {
        throw e;
      }
    }
  }
  throw new OperationError(
    outcomeFatal("internal", "Failed to retry transaction")
  );
}

export async function transaction<T>(
  ctx: FHIRServerCTX,
  client: pg.PoolClient,
  body: (ctx: FHIRServerCTX) => Promise<T>
): Promise<T> {
  if (ctx.inTransaction) return body(ctx);
  return retryFailedTransactions(5, async () => {
    try {
      // client.query("BEGIN");
      await client.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");
      const returnV = await body({ ...ctx, inTransaction: true });
      await client.query("END");
      console.log("DONE");
      return returnV;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });
}
