import * as dateFns from "date-fns";

import { date, dateTime } from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
} from "@iguhealth/fhir-types/versions";

import { r4_sp1_idx } from "../../schemas/generated/sp1-parameters/r4.sp1parameters.js";
import { r4b_sp1_idx } from "../../schemas/generated/sp1-parameters/r4b.sp1parameters.js";
import { getDatePrecision } from "../../utilities/search/parameters.js";

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
