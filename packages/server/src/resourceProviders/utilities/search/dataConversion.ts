import dayjs from "dayjs";

import {
  Address,
  canonical,
  CodeableConcept,
  Coding,
  ContactPoint,
  date,
  dateTime,
  HumanName,
  id,
  Identifier,
  instant,
  Period,
  Quantity,
  Range,
  Reference,
  ResourceType,
  SearchParameter,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  descend,
  MetaValueArray,
  MetaValueSingular,
} from "@iguhealth/meta-value";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../fhirServer.js";
import { getDecimalPrecision } from "./parameters.js";

// ---------------------------------------------------------
// [DATA TYPE CONVERSIONS]
// ---------------------------------------------------------
// https://hl7.org/fhir/r4/search.html#table
// ---------------------------------------------------------

export function toStringParameters(
  value: MetaValueSingular<NonNullable<unknown>>
): string[] {
  switch (value.meta()?.type) {
    // Even though spec states won't encounter this it does. [ImplementationGuide.description]
    case "markdown":
    case "string": {
      return [value.valueOf() as string];
    }
    case "HumanName": {
      const humanName = value.valueOf() as HumanName;
      return [
        humanName.text ? [humanName.text] : [],
        humanName.family ? [humanName.family] : [],
        humanName.given ? humanName.given : [],
        humanName.prefix ? humanName.prefix : [],
        humanName.suffix ? humanName.suffix : [],
      ].flat();
    }
    case "Address": {
      const address = value.valueOf() as Address;
      return [
        address.text ? [address.text] : [],
        address.line ? address.line : [],
        address.city ? [address.city] : [],
        address.district ? [address.district] : [],
        address.state ? [address.state] : [],
        address.postalCode ? [address.postalCode] : [],
        address.country ? [address.country] : [],
      ].flat();
    }
    default:
      throw new Error(`Unknown string parameter '${value.meta()?.type}'`);
  }
}

// Coding	Coding.system	Coding.code
// CodeableConcept	CodeableConcept.coding.system	CodeableConcept.coding.code	Matches against any coding in the CodeableConcept
// Identifier	Identifier.system	Identifier.value	Clients can search by type not system using the :of-type modifier, see below. To search on a CDA II.root - which may appear in either Identifier.system or Identifier.value, use the syntax identifier=|[root],[root]
// ContactPoint		ContactPoint.value	At the discretion of the server, token searches on ContactPoint may use special handling, such as ignoring punctuation, performing partial searches etc.
// code	(implicit)	code	the system is defined in the value set (though it's not usually needed)
// boolean		boolean	The implicit system for boolean values is http://hl7.org/fhir/special-values but this is never actually used
// uri		uri
// string	n/a	string	Token is sometimes used for string to indicate that exact matching is the correct default search strategy

export function toTokenParameters(
  parameter: SearchParameter,
  value: MetaValueSingular<NonNullable<unknown>>
): Array<{ system?: string; code?: string }> {
  switch (value.meta()?.type) {
    case "Coding": {
      const coding: Coding = value.valueOf() as CodeableConcept;
      return [{ system: coding.system, code: coding.code }];
    }
    case "CodeableConcept": {
      const codings = descend(value, "coding");
      if (codings instanceof MetaValueArray) {
        return codings
          .toArray()
          .map((v) => toTokenParameters(parameter, v))
          .flat();
      }
      return [];
    }
    case "Identifier": {
      const identifier: Identifier = value.valueOf() as Identifier;
      return [{ system: identifier.system, code: identifier.value }];
    }
    case "ContactPoint": {
      const contactPoint: ContactPoint = value.valueOf() as ContactPoint;
      return [{ code: contactPoint.value }];
    }
    case "code": {
      return [{ code: value.valueOf() as string }];
    }
    case "boolean": {
      return [
        {
          system: "http://hl7.org/fhir/special-values",
          code: (value.valueOf() as boolean).toString(),
        },
      ];
    }

    case "id":
    case "http://hl7.org/fhirpath/System.String":
    case "string": {
      return [
        {
          code: (value.valueOf() as string).toString(),
        },
      ];
    }
    default:
      throw new Error(
        `Unknown token parameter of type '${
          value.meta()?.type
        }' '${value.valueOf()}' indexing '${parameter.url}'`
      );
  }
}

export function toURIParameters(
  param: SearchParameter,
  value: MetaValueSingular<NonNullable<unknown>>
): string[] {
  switch (value.meta()?.type) {
    case "uri":
    case "url":
    case "uuid":
    case "canonical": {
      const v: canonical | uri = value.valueOf() as canonical | uri;
      return [v];
    }
    default:
      throw new Error(
        `Unknown uri parameter of type '${
          value.meta()?.type
        }' '${value.valueOf()}' indexing '${param.url}'`
      );
  }
}

export async function toReference(
  ctx: FHIRServerCTX,
  parameter: SearchParameter,
  value: MetaValueSingular<NonNullable<unknown>>
): Promise<
  Array<{
    reference: Reference;
    resourceType?: ResourceType;
    id?: id;
    url?: canonical | uri;
  }>
> {
  switch (value.meta()?.type) {
    case "Reference": {
      const reference: Reference = value.valueOf() as Reference;
      const [resourceType, id] = reference.reference?.split("/") || [];
      if (resourceTypes.has(resourceType) && id) {
        return [
          {
            reference: reference,
            resourceType: resourceType as ResourceType,
            id: id,
          },
        ];
      } else {
        // Need to determine how to handle identifier style references.
        return [];
        //return [{ reference: reference }];
      }
    }
    case "uri":
    case "canonical": {
      if (!parameter.target)
        throw new OperationError(
          outcomeError(
            "invalid",
            `no target specified on canonical search parameter '${parameter.name}'`
          )
        );
      const results = await ctx.client.search_system(ctx, [
        { name: "_type", value: parameter.target },
        { name: "url", value: [value.valueOf() as canonical | uri] },
      ]);
      if (results.resources.length !== 1) {
        return [];
      }
      return [
        {
          reference: {
            reference: `${results.resources[0].resourceType}/${results.resources[0].id}`,
          },
          resourceType: results.resources[0].resourceType,
          id: results.resources[0].id,
          url: value.valueOf() as canonical | uri,
        },
      ];
    }

    default:
      throw new Error(
        `Unknown reference parameter of type '${
          value.meta()?.type
        }' indexing '${parameter.url}'`
      );
  }
}

// const DATE_REGEX =
//   /^(?<year>[0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(?<month>0[1-9]|1[0-2])(-(?<day>0[1-9]|[1-2][0-9]|3[0-1]))?)?$/;

const DATE_TIME_REGEX =
  /^(?<year>[0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(?<month>0[1-9]|1[0-2])(-(?<day>0[1-9]|[1-2][0-9]|3[0-1])(T(?<hour>[01][0-9]|2[0-3]):(?<minute>[0-5][0-9]):(?<second>[0-5][0-9]|60)(?<ms>\.[0-9]{1,9})?)?)?(?<timezone>Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)?)?)?$/;

const precisionLevels = [
  "ms",
  "second",
  "minute",
  "hour",
  "day",
  "month",
  "year",
];

function getPrecision(v: date | dateTime) {
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
    outcomeError("invalid", `Invalid date or dateTime format '${v}'`)
  );
}

export function toDateRange(
  value: MetaValueSingular<NonNullable<unknown>>
): { start: string; end: string }[] {
  switch (value.meta()?.type) {
    case "Period": {
      const period: Period = value.valueOf() as Period;
      return [
        {
          start: period.start || "-infinity",
          end: period.end || "infinity",
        },
      ];
    }
    case "Timing": {
      const events = descend(value, "event");
      if (events instanceof MetaValueArray) {
        return events.toArray().map(toDateRange).flat();
      }
      return [];
    }
    case "instant": {
      const instant: instant = value.valueOf() as instant;
      return [
        {
          start: instant,
          end: instant,
        },
      ];
    }
    // TODO: Handle date and dateTime
    case "date": {
      const v: date = value.valueOf() as date;
      const precision = getPrecision(v);
      switch (precision) {
        case "day":
        case "month":
        case "year": {
          return [
            {
              start: dayjs(v, "YYYY-MM-DD").startOf(precision).toISOString(),
              end: dayjs(v, "YYYY-MM-DD").endOf(precision).toISOString(),
            },
          ];
        }
        default:
          throw new Error(`Unknown precision '${precision}'for date '${v}'`);
      }
    }
    case "dateTime": {
      const v: dateTime = value.valueOf() as dateTime;
      const precision = getPrecision(v);
      /* eslint-disable no-fallthrough */
      switch (precision) {
        case "ms": {
          return [{ start: v, end: v }];
        }
        case "second":
        case "minute":
        case "hour":
        case "day":
        case "month":
        case "year": {
          return [
            {
              start: dayjs(v, "YYYY-MM-DDThh:mm:ss+zz:zz")
                .startOf(precision)
                .toISOString(),
              end: dayjs(v, "YYYY-MM-DDThh:mm:ss+zz:zz")
                .endOf(precision)
                .toISOString(),
            },
          ];
        }
      }
    }
    default:
      throw new Error(`Cannot index as date value '${value.meta()?.type}'`);
  }
}

type QuantityIndex = Omit<Quantity, "value"> & { value?: number | string };

// Number and quantity dependent on the precision for indexing.
function getQuantityRange(value: number): { start: number; end: number } {
  const decimalPrecision = getDecimalPrecision(value);
  return {
    start: value - 0.5 * 10 ** -decimalPrecision,
    end: value + 0.5 * 10 ** -decimalPrecision,
  };
}

export function toQuantityRange(
  value: MetaValueSingular<NonNullable<unknown>>
): { start?: QuantityIndex; end?: QuantityIndex }[] {
  switch (value.meta()?.type) {
    case "Range": {
      const range: Range = value.valueOf() as Range;
      // Need to have some bound here otherwise would be returning infinite in both dirs.
      if (range.low?.value || range.high?.value) {
        return [
          {
            start: range.low || { ...range.high, value: "-infinity" },
            end: range.high || { ...range.low, value: "infinity" },
          },
        ];
      }
      return [];
    }
    case "Age":
    case "Money":
    case "Duration":
    case "Quantity": {
      const quantity: Quantity = value.valueOf() as Quantity;
      // using decimalprecision subtract .5 of  decimal precision to get lower bound
      // and add .5 of decimal precision to get upper bound
      if (quantity.value) {
        const range = getQuantityRange(quantity.value);
        return [
          {
            start: {
              ...quantity,
              value: range.start,
            },
            end: {
              ...quantity,
              value: range.end,
            },
          },
        ];
      }
      return [];
    }
    default:
      throw new Error(
        `Unable to index as quantity value '${value.meta()?.type}'`
      );
  }
}
