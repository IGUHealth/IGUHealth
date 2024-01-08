import type * as s from "zapatos/schema";
import * as db from "zapatos/db";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../fhir/context.js";
import {
  SearchParameterResource,
  getDecimalPrecision,
} from "../../../utilities/search/parameters.js";

export default function numberClauses(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource
): db.SQLFragment<boolean | null, never> {
  return db.conditions.or(
    ...parameter.value.map((value): db.SQLFragment => {
      const result = value
        .toString()
        .match(/^(?<prefix>eq|ne|gt|lt|ge|le|sa|eb|ap)?(?<value>.+)$/);

      if (!result) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Invalid input value '${parameter.value}' for parameter '${parameter.searchParameter.name}'`
          )
        );
      }
      const numericPortion = result?.groups?.value;
      const prefix = result?.groups?.prefix;

      if (!numericPortion) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `A Number must be provided for parameter '${parameter.searchParameter.name}'`
          )
        );
      }

      const numberValue = parseFloat(numericPortion);
      if (isNaN(numberValue)) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Invalid number value '${parameter.value}' for parameter '${parameter.searchParameter.name}'`
          )
        );
      }

      const paramValue = db.param(numberValue);
      const precision = db.param(-getDecimalPrecision(numberValue));

      switch (prefix) {
        // the range of the search value fully contains the range of the target value
        case "eq":
        case undefined: {
          return db.sql<s.number_idx.SQL>`
          (${"value"} - 0.5 * 10 ^ ${precision}) <= ${paramValue} AND
          (${"value"} + 0.5 * 10 ^ ${precision}) >= ${paramValue}`;
        }

        // 	the range of the search value does not fully contain the range of the target value
        case "ne": {
          return db.sql<s.number_idx.SQL>`
          (${"value"} - 0.5 * 10 ^ ${precision}) > ${paramValue} OR
          (${"value"} + 0.5 * 10 ^ ${precision}) < ${paramValue}`;
        }

        // the range above the search value intersects (i.e. overlaps) with the range of the target value
        case "gt": {
          return db.sql<s.number_idx.SQL>`(${"value"} - 0.5 * 10 ^ ${precision}) > ${paramValue}`;
        }
        //	the value for the parameter in the resource is less than the provided value
        case "lt": {
          // Start at upperbound to exclude the intersection.
          return db.sql<s.number_idx.SQL>`(${"value"} + 0.5 * 10 ^ ${precision}) < ${paramValue}`;
        }
        // the range above the search value intersects (i.e. overlaps) with the range of the target value,
        // or the range of the search value fully contains the range of the target value
        case "ge": {
          // Perform search as GT but use >= and start on upperbound.
          return db.sql<s.number_idx.SQL>`(${"value"} + 0.5 * 10 ^ ${precision}) >= ${paramValue}`;
        }
        case "le": {
          // Perform search as lt but use <= and start on lowerbound
          return db.sql<s.number_idx.SQL>`(${"value"} - 0.5 * 10 ^ ${precision}) <= ${paramValue}`;
        }
        case "sa":
        case "eb":
        case "ap":
        default:
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Prefix '${prefix}' not supported for parameter '${parameter.searchParameter.name}'`
            )
          );
      }
    })
  );
}
