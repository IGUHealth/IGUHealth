import { FHIRClientAsync } from "@iguhealth/client/interface";
import { FHIRRequest } from "@iguhealth/client/types";
import { ParsedParameter } from "@iguhealth/client/url";
import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
import { date, dateTime } from "@iguhealth/fhir-types/r4/types";
import * as r4bSets from "@iguhealth/fhir-types/r4b/sets";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import {
  isSearchTableType,
  search_table_types,
} from "../../providers/postgres/constants.js";

export type SearchParameterResource = ParsedParameter<string | number> & {
  type: "resource";
  searchParameter: Resource<FHIR_VERSION, "SearchParameter">;
  chainedParameters?: Resource<FHIR_VERSION, "SearchParameter">[][];
};

export type SearchParameterResult = ParsedParameter<string | number> & {
  type: "result";
};

export type ParameterType = SearchParameterResource | SearchParameterResult;

export function deriveLimit(
  range: [number, number],
  userLimit?: ParsedParameter<string | number>,
): number {
  const limit =
    userLimit &&
    !isNaN(parseInt((userLimit.value && userLimit.value[0]).toString()))
      ? Math.min(
          Math.max(
            parseInt((userLimit.value && userLimit.value[0]).toString()),
            range[0],
          ),
          range[1],
        )
      : range[1];

  return limit;
}

export function searchResources(
  resourceTypes: AllResourceTypes[],
): (ResourceType<FHIR_VERSION> | string)[] {
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

export function searchParameterToTableName<
  Version extends FHIR_VERSION,
  Type extends string,
>(
  fhirVersion: Version,
  searchparameter_type: Type,
): `${Version extends R4 ? "r4" : "r4b"}_${Type}_idx` {
  if (isSearchTableType(searchparameter_type)) {
    switch (fhirVersion) {
      case R4B: {
        return `r4b_${searchparameter_type}_idx` as `${Version extends "4.0" ? "r4" : "r4b"}_${Type}_idx`;
      }
      case R4: {
        return `r4_${searchparameter_type}_idx` as `${Version extends "4.0" ? "r4" : "r4b"}_${Type}_idx`;
      }
    }
  }
  throw new OperationError(
    outcomeError(
      "not-supported",
      `Search Parameter of type '${searchparameter_type}' is not supported`,
    ),
  );
}

// Returns the resourceType from request on type level else uses the _type parameter or empty specifying no filter on specific resource.
function _deriveResourceTypeFilter(request: FHIRRequest): string[] {
  switch (request.type) {
    case "search-request": {
      if (request.level === "type") return [request.resource];
      const _typeParameter = request.parameters.find((p) => p.name === "_type");
      if (_typeParameter)
        return _typeParameter.value as ResourceType<FHIR_VERSION>[];
      return [];
    }
    default:
      return "resource" in request ? [request.resource] : [];
  }
}

export function deriveResourceTypeFilter<Request extends FHIRRequest>(
  request: Request,
): ResourceType<Request["fhirVersion"]>[] {
  const passedinTypes = _deriveResourceTypeFilter(
    request,
  ) as ResourceType<FHIR_VERSION>[];

  const resourceTypes =
    request.fhirVersion === R4B ? r4bSets.resourceTypes : r4Sets.resourceTypes;

  for (const type of passedinTypes) {
    if (!resourceTypes.has(type)) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Resource Type '${type}' is not supported`,
        ),
      );
    }
  }
  return passedinTypes as ResourceType<Request["fhirVersion"]>[];
}

/*
 * Returns resourceTypes to perform a search which involves concating
 * Given type with heirarchy of inherited types (DomainResource, Resource)
 */
export function typesToSearch(
  resourceTypes: ResourceType<FHIR_VERSION>[],
): (ResourceType<FHIR_VERSION> | string)[] {
  const searchTypes = ["Resource", "DomainResource"];
  if (resourceTypes.length > 0) {
    return searchTypes.concat(resourceTypes);
  }
  return searchTypes;
}

async function associateChainedParameters(
  parsedParameter: SearchParameterResource,
  resolveSearchParameter: (
    resourceTypes: AllResourceTypes[],
    name: string,
  ) => Promise<Resource<FHIR_VERSION, "SearchParameter">[]>,
): Promise<SearchParameterResource> {
  if (!parsedParameter.chains) return parsedParameter;

  // All middle chains should be references.
  let last = [parsedParameter.searchParameter];
  const chainedParameters: Resource<FHIR_VERSION, "SearchParameter">[][] = [];

  for (const chain of parsedParameter.chains) {
    const targets = last
      .map((l) => {
        if (l.type !== "reference")
          throw new OperationError(
            outcomeError(
              "invalid",
              `SearchParameter with name '${l.name}' is not a reference.`,
            ),
          );
        return l.target || [];
      })
      .flat();

    const chainParameter = await resolveSearchParameter(
      targets as AllResourceTypes[],
      chain,
    );

    if (chainParameter.length === 0)
      throw new OperationError(
        outcomeError(
          "not-found",
          `SearchParameter with name '${chain}' not found in chain.`,
        ),
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
  parameter: ParsedParameter<string | number>,
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
    case "_include":
    case "_revinclude":
      return true;
    case "_summary":
    case "_elements":
    case "_contained":
    case "_containedType": {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameter of type '${parameter.name}' is not yet supported.`,
        ),
      );
    }
    default:
      return false;
  }
}

export async function findSearchParameter<
  CTX,
  Client extends FHIRClientAsync<CTX>,
  Version extends FHIR_VERSION,
>(
  client: Client,
  ctx: CTX,
  fhirVersion: Version,
  resourceTypes: AllResourceTypes[],
  code: string,
): Promise<Resource<Version, "SearchParameter">[]> {
  const result = await client.search_type(ctx, fhirVersion, "SearchParameter", [
    { name: "code", value: [code] },
    {
      name: "type",
      value: search_table_types,
    },
    {
      name: "base",
      value: searchResources(resourceTypes),
    },
  ]);

  return result.resources;
}

type ResolveSearchParameter = (
  resourceTypes: AllResourceTypes[],
  name: string,
) => Promise<Resource<FHIR_VERSION, "SearchParameter">[]>;

export async function parametersWithMetaAssociated(
  resolveSearchParameter: ResolveSearchParameter,
  resourceTypes: AllResourceTypes[],
  parameters: ParsedParameter<string | number>[],
): Promise<ParameterType[]> {
  const result = await Promise.all(
    parameters.map(async (p) => {
      if (isSearchResultParameter(p)) {
        const param: SearchParameterResult = { ...p, type: "result" };
        return param;
      }

      const searchParameterSearchResult = await resolveSearchParameter(
        resourceTypes,
        p.name,
      );

      if (searchParameterSearchResult.length === 0) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `SearchParameter with name '${
              p.name
            }' not found for types '${resourceTypes.join(", ")}'.`,
          ),
        );
      }

      if (searchParameterSearchResult.length > 1)
        throw new OperationError(
          outcomeError(
            "invalid",
            `SearchParameter with name '${p.name}' found multiple parameters '${searchParameterSearchResult.map((s) => s.id).join(", ")}'.`,
          ),
        );

      const searchParameter = searchParameterSearchResult[0];
      const param: SearchParameterResource = {
        ...p,
        type: "resource",
        searchParameter: searchParameter,
      };
      return associateChainedParameters(param, resolveSearchParameter);
    }),
  );

  return result;
}

const PREFIX_REG = /^(?<prefix>eq|ne|gt|lt|ge|le|sa|eb|ap)?(?<value>.+)$/;

/**
 * Derives the value and prefix being used.
 * The following parameter types support prefixes: number, date, and quantity
 * The types of prefixes are defined here  number, date, and quantity.
 * @param value Parameter value.
 */
export function parseValuePrefix(value: string | number): {
  prefix: string | undefined;
  value: string;
} {
  const result = PREFIX_REG.exec(value.toString());

  if (!result) {
    throw new OperationError(
      outcomeError("invalid", `Invalid input value '${value}' for parameter.`),
    );
  }
  const valuePortion = result.groups?.value;
  const prefix = result.groups?.prefix;

  if (!valuePortion) {
    throw new OperationError(
      outcomeError("invalid", `A value must be provided for parameter.`),
    );
  }

  return {
    prefix,
    value: valuePortion,
  };
}

const DATE_TIME_REGEX =
  /^(?<year>\d(\d(\d[1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(?<month>0[1-9]|1[0-2])(-(?<day>0[1-9]|[1-2]\d|3[0-1])(T(?<hour>[01]\d|2[0-3])(:(?<minute>[0-5]\d)(:(?<second>[0-5]\d|60))?)?)?)?(?<timezone>Z|(\+|-)((0\d|1[0-3]):[0-5]\d|14:00)?)?)?$/;

const precisionLevels = <const>[
  "second",
  "minute",
  "hour",
  "day",
  "month",
  "year",
];

export function getDatePrecision(v: date | dateTime) {
  const match = v.match(DATE_TIME_REGEX);
  if (match) {
    for (const precision of precisionLevels) {
      if (match.groups?.[precision]) {
        return precision;
      }
    }
    throw new Error(`could not determine precision level of '${v}'`);
  }
  throw new OperationError(
    outcomeError("invalid", `Invalid date or dateTime format '${v}'`),
  );
}
