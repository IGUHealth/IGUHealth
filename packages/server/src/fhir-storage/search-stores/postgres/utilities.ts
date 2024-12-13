import dayjs from "dayjs";
import { getDatePrecision } from "../../utilities/search/parameters.js";
import { date, dateTime } from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { r4_sp1_idx } from "../../providers/middleware/postgres/generated/sp1-parameters/r4.sp1parameters.js";
import { r4b_sp1_idx } from "../../providers/middleware/postgres/generated/sp1-parameters/r4b.sp1parameters.js";

export function getDateRange(value: string): [string, string] {
  // yyyy-mm-ddThh:mm:ss[Z|(+|-)hh:mm]
  const formattedDate = dayjs(value, "YYYY-MM-DDThh:mm:ssZ");
  const precision = getDatePrecision(value as dateTime | date);

  switch (precision) {
    case "year":
    case "month":
    case "day":
    case "hour":
    case "minute":
    case "second": {
      return [
        dayjs(formattedDate).startOf(precision).toISOString(),
        dayjs(formattedDate).endOf(precision).toISOString(),
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
