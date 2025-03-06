import { AllInteractions, FHIRRequest } from "@iguhealth/client/types";
import {
  MetaParameter,
  ParsedParameter,
  SearchParameterResource,
  SearchParameterResult,
} from "@iguhealth/client/url";
import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
import { code, date, dateTime, uri } from "@iguhealth/fhir-types/r4/types";
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
import { resolveParameterCodeToCanonical } from "@iguhealth/search-parameters/api/parameter-resolution";

import { isSearchTableType } from "./constants.js";
import { IGUHealthServerCTX } from "../fhir-server/types.js";

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
): ResourceType<FHIR_VERSION>[] {
  const searchTypes = ["Resource", "DomainResource"];
  if (resourceTypes.length > 0) {
    return searchTypes.concat(resourceTypes) as ResourceType<FHIR_VERSION>[];
  }
  return searchTypes as ResourceType<FHIR_VERSION>[];
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
function _deriveResourceTypeFilter(
  request: FHIRRequest<FHIR_VERSION, AllInteractions>,
): string[] {
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

export function deriveResourceTypeFilter<
  Request extends FHIRRequest<FHIR_VERSION, AllInteractions>,
>(request: Request): ResourceType<Request["fhirVersion"]>[] {
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

async function associateChainedParameters<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parsedParameter: SearchParameterResource<Version>,
): Promise<SearchParameterResource<Version>> {
  if (!parsedParameter.chains) return parsedParameter;

  // All middle chains should be references.
  let last = [parsedParameter.searchParameter];
  const chainedParameters: Resource<Version, "SearchParameter">[][] = [];

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

    const canonicalURLs = resolveParameterCodeToCanonical(
      fhirVersion,
      searchResources(
        targets as ResourceType<Version>[],
      ) as ResourceType<Version>[],
      chain as code,
    );

    if (!canonicalURLs) {
      throw new OperationError(
        outcomeError(
          "not-found",
          `SearchParameter with name '${chain}' not found in chain.`,
        ),
      );
    }

    const chainParameters = await ctx.resolveCanonical(
      ctx,
      fhirVersion,
      "SearchParameter",
      canonicalURLs,
    );

    if (chainParameters.length === 0) {
      throw new OperationError(
        outcomeError(
          "not-found",
          `SearchParameter with name '${chain}' not found in chain.`,
        ),
      );
    }

    last = chainParameters;
    chainedParameters.push(chainParameters);
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

async function processResourceParameters<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
  resourceParameters: ParsedParameter<string | number>[],
): Promise<SearchParameterResource<Version>[]> {
  const searchParametersURLS = resourceParameters.map((p) => {
    const canonicalURL = resolveParameterCodeToCanonical(
      fhirVersion,
      searchResources(resourceTypes) as ResourceType<Version>[],
      p.name as code,
    );

    if (canonicalURL.length === 0) {
      throw new OperationError(
        outcomeError(
          "not-found",
          `SearchParameter with name '${p.name}' not found for types '${resourceTypes.join(", ")}'.`,
        ),
      );
    }
    if (canonicalURL.length > 1) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `SearchParameter with name '${p.name}' has multiple definitions.`,
        ),
      );
    }
    return canonicalURL[0];
  });

  const searchParameters = await ctx.resolveCanonical(
    ctx,
    fhirVersion,
    "SearchParameter",
    searchParametersURLS,
  );

  const parameterURLHash = searchParameters.reduce(
    (acc: Record<uri, Resource<Version, "SearchParameter">>, p) => {
      acc[p.url] = p;
      return acc;
    },
    {},
  );

  const searchResourceParameters = await Promise.all(
    searchParametersURLS.map((url, i) => {
      const parameter = resourceParameters[i];
      const searchParameter = parameterURLHash[url];

      if (searchParameter === undefined) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `SearchParameter with name '${parameter.name}' not found for types '${resourceTypes.join(", ")}'. '${searchParametersURLS.join(",")}'`,
          ),
        );
      }

      const param: SearchParameterResource<Version> = {
        ...parameter,
        type: "resource",
        searchParameter: searchParameter,
      };

      return associateChainedParameters(ctx, fhirVersion, param);
    }),
  );

  return searchResourceParameters;
}

/**
 * Split the parameters into the result parameters (e.g. Offset, Count) and the resource parameters (e.g. status, code etc...)).
 * @param parameters Parsed Parameters to split
 * @returns Object containing the resource and result parameters.
 */
function splitParameterTypes(parameters: ParsedParameter<string | number>[]): {
  resourceParameters: ParsedParameter<string | number>[];
  resultParameters: ParsedParameter<string | number>[];
} {
  const resultParameters: ParsedParameter<string | number>[] = [];
  const resourceParameters: ParsedParameter<string | number>[] = [];
  for (const p of parameters) {
    if (isSearchResultParameter(p)) {
      resultParameters.push(p);
    } else {
      resourceParameters.push(p);
    }
  }

  return { resultParameters, resourceParameters };
}

export async function parametersWithMetaAssociated<
  Version extends FHIR_VERSION,
>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
  parameters: ParsedParameter<string | number>[],
): Promise<MetaParameter<Version>[]> {
  const { resourceParameters, resultParameters } =
    splitParameterTypes(parameters);

  const searchResourceParameters = await processResourceParameters(
    ctx,
    fhirVersion,
    resourceTypes,
    resourceParameters,
  );

  const searchResultParameters = resultParameters.map(
    (r) =>
      ({
        ...r,
        type: "result",
      }) as SearchParameterResult,
  );

  return [...searchResultParameters, ...searchResourceParameters];
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
