import dayjs from "dayjs";
import { getDatePrecision } from "../../../../utilities/search/parameters.js";
import { date, dateTime } from "@iguhealth/fhir-types/r4/types";

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
