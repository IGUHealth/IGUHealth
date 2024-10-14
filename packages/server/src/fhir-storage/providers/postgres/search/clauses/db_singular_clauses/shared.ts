import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as r4Sp1Parameters from "../../../generated/sp1-parameters/r4.sp1parameters.js";
import * as r4bSp1Parameters from "../../../generated/sp1-parameters/r4b.sp1parameters.js";
import { SearchParameterResource } from "../../../../../utilities/search/parameters.js";
import { uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";

export type SEARCH_INDEX_WHEREABLE =
  | s.r4_sp1_idx.Whereable
  | s.r4b_sp1_idx.Whereable;

export type SINGULAR_TYPE =
  | "date"
  | "number"
  | "quantity"
  | "string"
  | "token"
  | "uri";

type ColumnType = {
  [R4]: {
    date: r4Sp1Parameters.r4_sp1_idx_date;
    number: r4Sp1Parameters.r4_sp1_idx_number;
    quantity: r4Sp1Parameters.r4_sp1_idx_quantity;
    string: r4Sp1Parameters.r4_sp1_idx_string;
    token: r4Sp1Parameters.r4_sp1_idx_token;
    uri: r4Sp1Parameters.r4_sp1_idx_uri;
  };
  [R4B]: {
    date: r4bSp1Parameters.r4b_sp1_idx_date;
    number: r4bSp1Parameters.r4b_sp1_idx_number;
    quantity: r4bSp1Parameters.r4b_sp1_idx_quantity;
    string: r4bSp1Parameters.r4b_sp1_idx_string;
    token: r4bSp1Parameters.r4b_sp1_idx_token;
    uri: r4bSp1Parameters.r4b_sp1_idx_uri;
  };
};

const Conversion: {
  [R4]: {
    date: typeof r4Sp1Parameters.asSP1Date;
    number: typeof r4Sp1Parameters.asSP1Number;
    quantity: typeof r4Sp1Parameters.asSP1Quantity;
    string: typeof r4Sp1Parameters.asSP1String;
    token: typeof r4Sp1Parameters.asSP1Token;
    uri: typeof r4Sp1Parameters.asSP1Uri;
  };
  [R4B]: {
    date: typeof r4bSp1Parameters.asSP1Date;
    number: typeof r4bSp1Parameters.asSP1Number;
    quantity: typeof r4bSp1Parameters.asSP1Quantity;
    string: typeof r4bSp1Parameters.asSP1String;
    token: typeof r4bSp1Parameters.asSP1Token;
    uri: typeof r4bSp1Parameters.asSP1Uri;
  };
} = {
  [R4]: {
    date: r4Sp1Parameters.asSP1Date,
    number: r4Sp1Parameters.asSP1Number,
    quantity: r4Sp1Parameters.asSP1Quantity,
    string: r4Sp1Parameters.asSP1String,
    token: r4Sp1Parameters.asSP1Token,
    uri: r4Sp1Parameters.asSP1Uri,
  },
  [R4B]: {
    date: r4bSp1Parameters.asSP1Date,
    number: r4bSp1Parameters.asSP1Number,
    quantity: r4bSp1Parameters.asSP1Quantity,
    string: r4bSp1Parameters.asSP1String,
    token: r4bSp1Parameters.asSP1Token,
    uri: r4bSp1Parameters.asSP1Uri,
  },
};

export function getSp1Column<
  Version extends FHIR_VERSION,
  Type extends SINGULAR_TYPE,
>(version: Version, type: Type, uri: uri): ColumnType[Version][Type] {
  const returnVal = Conversion[version][type](uri);

  if (returnVal === undefined) {
    throw new OperationError(
      outcomeError(
        "not-supported",
        `Parameter with url '${uri}' is not supported for singular values.`,
      ),
    );
  }

  return returnVal as ColumnType[Version][Type];
}

export function missingModifier(
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  return db.conditions.or(
    ...parameter.value.map(
      (value): SEARCH_INDEX_WHEREABLE | db.SQLFragment<boolean> => {
        if (value !== "true" && value !== "false") {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Invalid value for modifier 'missing' must be 'true' or 'false'`,
            ),
          );
        }
        if (value === "true") {
          throw new OperationError(
            outcomeError(
              "not-supported",
              "For modifier 'missing' value of 'true' is not yet supported",
            ),
          );
        }
        const type = parameter.searchParameter.type;
        switch (type) {
          case "string":
          case "number":
          case "uri": {
            const column = getSp1Column(
              fhirVersion,
              type as "string" | "number" | "uri",
              parameter.searchParameter.url,
            );

            return db.sql<
              s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL,
              boolean
            >`${column} IS NOT NULL`;
          }

          case "token": {
            const column = getSp1Column(
              fhirVersion,
              "token",
              parameter.searchParameter.url,
            );

            return db.sql<
              s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL,
              boolean
            >`${`${column}_value`} IS NOT NULL`;
          }

          case "date": {
            const column = getSp1Column(
              fhirVersion,
              "date",
              parameter.searchParameter.url,
            );
            return db.sql<
              s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL,
              boolean
            >`${`${column}_start`} IS NOT NULL OR ${`${column}_end`} IS NOT NULL`;
          }

          case "quantity": {
            const column = getSp1Column(
              fhirVersion,
              "quantity",
              parameter.searchParameter.url,
            );
            return db.sql<
              s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL,
              boolean
            >`${`${column}_start_code`} IS NOT NULL OR ${`${column}_end_code`} IS NOT NULL`;
          }
          default:
            throw new OperationError(
              outcomeError(
                "not-supported",
                `Parameter of type '${parameter.searchParameter.type}' is not yet supported for missing modifier.`,
              ),
            );
        }
      },
    ),
  );
}
