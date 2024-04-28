import dayjs from "dayjs";

import { r4ResourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  Address,
  CodeableConcept,
  Coding,
  ContactPoint,
  HumanName,
  Identifier,
  Period,
  Quantity,
  Range,
  Reference,
  ResourceType,
  canonical,
  date,
  dateTime,
  id,
  instant,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  R4,
  VersionedAResource,
  VersionedResourceType,
} from "@iguhealth/fhir-types/versions";
import {
  MetaValueArray,
  MetaValueSingular,
  descend,
} from "@iguhealth/meta-value";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { getDecimalPrecision } from "./parameters.js";

// ---------------------------------------------------------
// [DATA TYPE CONVERSIONS]
// ---------------------------------------------------------
// https://hl7.org/fhir/r4/search.html#table
// ---------------------------------------------------------

function toStringParameters(
  value: MetaValueSingular<NonNullable<unknown>>,
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

function toTokenParameters(
  value: MetaValueSingular<NonNullable<unknown>>,
): Array<{ system?: string; code?: string }> {
  switch (value.meta()?.type) {
    case "Coding": {
      const coding: Coding = value.valueOf() as CodeableConcept;
      return [{ system: coding.system, code: coding.code }];
    }
    case "CodeableConcept": {
      const codings = descend(value, "coding");
      if (codings instanceof MetaValueArray) {
        return codings.toArray().map(toTokenParameters).flat();
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
        }' '${value.valueOf()}' indexing'`,
      );
  }
}

function toURIParameters(
  value: MetaValueSingular<NonNullable<unknown>>,
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
        }' '${value.valueOf()}' indexing`,
      );
  }
}

function toReferenceLocal(
  value: MetaValueSingular<NonNullable<unknown>>,
): Array<{
  reference: Reference;
  resourceType?: ResourceType;
  id?: id;
  url?: canonical | uri;
}> {
  switch (value.meta()?.type) {
    case "Reference": {
      const reference: Reference = value.valueOf() as Reference;
      const [resourceType, id] = reference.reference?.split("/") || [];
      if (r4ResourceTypes.has(resourceType) && id) {
        return [
          {
            reference: reference,
            resourceType: resourceType as ResourceType,
            id: id as id,
          },
        ];
      } else {
        // Need to determine how to handle identifier style references.
        return [];
        //return [{ reference: reference }];
      }
    }

    case "uri":
    case "canonical":
    default: {
      return [];
    }
  }
}

export type ResolveRemoteCanonical = <FHIRVersion extends FHIR_VERSION>(
  fhirVersion: FHIRVersion,
  types: VersionedResourceType<FHIRVersion>[],
  url: canonical,
) => Promise<
  | VersionedAResource<FHIRVersion, VersionedResourceType<FHIRVersion>>
  | undefined
>;

async function toReferenceRemote(
  parameter: VersionedAResource<FHIR_VERSION, "SearchParameter">,
  value: MetaValueSingular<NonNullable<unknown>>,
  resolveCanonical?: ResolveRemoteCanonical,
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
      if (r4ResourceTypes.has(resourceType) && id) {
        return [
          {
            reference: reference,
            resourceType: resourceType as ResourceType,
            id: id as id,
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
            `no target specified on canonical search parameter '${parameter.name}'`,
          ),
        );
      const resource = resolveCanonical
        ? await resolveCanonical(
            R4,
            parameter.target as ResourceType[],
            value.valueOf().toString() as canonical,
          )
        : undefined;

      if (!resource) {
        return [];
      }

      return [
        {
          reference: {
            reference: `${resource.resourceType}/${resource.id}`,
          },
          resourceType: resource.resourceType,
          id: resource.id,
          url: value.valueOf() as canonical | uri,
        },
      ];
    }

    default:
      throw new Error(
        `Unknown reference parameter of type '${
          value.meta()?.type
        }' indexing '${parameter.url}'`,
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
    outcomeError("invalid", `Invalid date or dateTime format '${v}'`),
  );
}

function toDateRange(
  value: MetaValueSingular<NonNullable<unknown>>,
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

function toQuantityRange(
  value: MetaValueSingular<NonNullable<unknown>>,
): { start: QuantityIndex; end: QuantityIndex }[] {
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
        `Unable to index as quantity value '${value.meta()?.type}'`,
      );
  }
}

export type SEARCH_TYPE =
  | "number"
  | "date"
  | "string"
  | "token"
  | "reference"
  | "composite"
  | "quantity"
  | "uri"
  | "special";

type DATA_CONVERSION = {
  number: number[][number];
  date: Awaited<ReturnType<typeof toDateRange>>[number];
  string: Awaited<ReturnType<typeof toStringParameters>>[number];
  token: Awaited<ReturnType<typeof toTokenParameters>>[number];
  reference: Awaited<ReturnType<typeof toReferenceRemote>>[number];
  quantity: Awaited<ReturnType<typeof toQuantityRange>>[number];
  uri: Awaited<ReturnType<typeof toURIParameters>>[number];

  /**
   * Not supporting composite or special in memory index.
   */
  composite: never;
  special: never;
};

export type ADataConversion<T extends SEARCH_TYPE> = DATA_CONVERSION[T];

export function dataConversionLocal<T extends SEARCH_TYPE>(
  type: T,
  evaluation: MetaValueSingular<NonNullable<unknown>>[],
): ADataConversion<T>[] {
  switch (type) {
    case "number": {
      return evaluation.map((e) => e.valueOf()) as ADataConversion<
        typeof type
      >[];
    }
    case "string": {
      return evaluation.map(toStringParameters).flat() as ADataConversion<
        typeof type
      >[];
    }
    case "token": {
      return evaluation.map(toTokenParameters).flat() as ADataConversion<
        typeof type
      >[];
    }
    case "uri": {
      return evaluation.map(toURIParameters).flat() as ADataConversion<
        typeof type
      >[];
    }
    case "quantity": {
      return evaluation.map(toQuantityRange).flat() as ADataConversion<
        typeof type
      >[];
    }
    case "date": {
      return evaluation.map(toDateRange).flat() as ADataConversion<
        typeof type
      >[];
    }
    case "reference": {
      return evaluation.map(toReferenceLocal).flat() as ADataConversion<
        typeof type
      >[];
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

export default async function dataConversion<T extends SEARCH_TYPE>(
  parameter: VersionedAResource<FHIR_VERSION, "SearchParameter">,
  type: T,
  evaluation: MetaValueSingular<NonNullable<unknown>>[],
  resolveRemoteCanonical?: ResolveRemoteCanonical,
): Promise<ADataConversion<T>[]> {
  switch (type) {
    case "number":
    case "string":
    case "token":
    case "uri":
    case "quantity":
    case "date": {
      return dataConversionLocal(type, evaluation);
    }
    case "reference": {
      return (
        await Promise.all(
          evaluation.map((v) =>
            toReferenceRemote(parameter, v, resolveRemoteCanonical),
          ),
        )
      ).flat() as ADataConversion<typeof type>[];
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
