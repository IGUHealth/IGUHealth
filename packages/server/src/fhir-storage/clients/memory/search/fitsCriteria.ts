import * as dateTz from "@date-fns/tz";
import * as dateFns from "date-fns";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import {
  ADataConversion,
  SEARCH_TYPE,
} from "../../../utilities/search/dataConversion.js";

export default function fitsCriteria<T extends SEARCH_TYPE>(
  type: T,
  data: ADataConversion<T>,
  parameters: (number | string)[],
): boolean {
  switch (type) {
    case "number": {
      return parameters.includes(data as ADataConversion<"number">);
    }

    case "string": {
      return parameters.some((p) =>
        (data as ADataConversion<"string">)
          .toLowerCase()
          .startsWith(p.toString().toLowerCase()),
      );
    }

    case "token": {
      /**
       * [TODO] not evaluating the system.
       */
      const code = (data as ADataConversion<"token">).code;
      if (code && parameters.includes(code)) return true;

      return false;
    }

    case "uri": {
      return parameters.includes(data as ADataConversion<"uri">);
    }

    case "reference": {
      const ref = data as ADataConversion<"reference">;

      return parameters.some((param) => {
        const pieces = param.toString().split("/");
        if (pieces.length === 1) {
          return ref.id === pieces[0] || ref.url === pieces[0];
        }
        if (pieces.length === 2) {
          return ref.resourceType === pieces[0] && ref.id === pieces[1];
        }
      });
    }

    case "quantity": {
      const range = data as ADataConversion<"quantity">;
      return parameters.some((param) => {
        const low = range.start.value ? range.start.value : Number.MIN_VALUE;
        const high =
          range.end.value && range.end.value !== "infinite"
            ? range.end.value
            : Number.MAX_VALUE;
        return param >= low && param <= high;
      });
    }

    case "date": {
      const range = data as ADataConversion<"date">;

      return parameters.some((param) => {
        const date = dateFns.parseISO(param.toString());
        const res = dateFns.isWithinInterval(date, {
          start: dateFns.parseISO(range.start),
          end: dateFns.parseISO(range.end),
        });

        return res;
      });
    }

    case "composite":
    case "special":
    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Memory search does not support '${type}' yet.`,
        ),
      );
    }
  }
}
