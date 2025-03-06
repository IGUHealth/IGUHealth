import * as dateFns from "date-fns";

import { date, dateTime } from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { getAllSearchParameterParameters } from "@iguhealth/search-parameters/api/parameter-resolution";

import { IGUHealthServerCTX, asRoot } from "../../fhir-server/types.js";
import { r4_sp1_idx } from "../../migrations/sp1-parameters/r4.sp1parameters.js";
import { r4b_sp1_idx } from "../../migrations/sp1-parameters/r4b.sp1parameters.js";
import { search_types_supported } from "../constants.js";
import { getDatePrecision, searchResources } from "../parameters.js";

export async function getAllParametersForResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
): Promise<Resource<Version, "SearchParameter">[]> {
  switch (resourceType) {
    case "SearchParameter": {
      return getAllSearchParameterParameters(fhirVersion);
    }
    default: {
      const parameters = [
        {
          name: "type",
          value: search_types_supported,
        },
        {
          name: "base",
          value: searchResources([resourceType]),
        },
      ];

      return (
        await ctx.client.search_type(
          asRoot(ctx),
          fhirVersion,
          "SearchParameter",
          parameters,
        )
      ).resources;
    }
  }
}

export function getDateRange(value: string): [string, string] {
  // yyyy-mm-ddThh:mm:ss[Z|(+|-)hh:mm]
  const formattedDate = dateFns.parseISO(value);
  const precision = getDatePrecision(value as dateTime | date);

  switch (precision) {
    case "year": {
      return [
        dateFns.startOfYear(formattedDate).toISOString(),
        dateFns.endOfYear(formattedDate).toISOString(),
      ];
    }
    case "month": {
      return [
        dateFns.startOfMonth(formattedDate).toISOString(),
        dateFns.endOfMonth(formattedDate).toISOString(),
      ];
    }
    case "day": {
      return [
        dateFns.startOfDay(formattedDate).toISOString(),
        dateFns.endOfDay(formattedDate).toISOString(),
      ];
    }
    case "hour": {
      return [
        dateFns.startOfHour(formattedDate).toISOString(),
        dateFns.endOfHour(formattedDate).toISOString(),
      ];
    }
    case "minute": {
      return [
        dateFns.startOfMinute(formattedDate).toISOString(),
        dateFns.endOfMinute(formattedDate).toISOString(),
      ];
    }
    case "second": {
      return [
        dateFns.startOfSecond(formattedDate).toISOString(),
        dateFns.endOfSecond(formattedDate).toISOString(),
      ];
    }
  }
}

export function isSearchParameterInSingularTable<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  parameter: Resource<Version, "SearchParameter">,
): boolean {
  switch (fhirVersion) {
    case R4: {
      return r4_sp1_idx.has(parameter.url);
    }
    case R4B: {
      return r4b_sp1_idx.has(parameter.url);
    }
    default: {
      throw new Error("Unsupported FHIR version");
    }
  }
}
