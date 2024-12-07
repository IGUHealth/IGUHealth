import dayjs from "dayjs";

import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
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
  canonical,
  date,
  dateTime,
  id,
  instant,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import * as fp from "@iguhealth/fhirpath";
import { IMetaValue } from "@iguhealth/meta-value/interface";
import { flatten } from "@iguhealth/meta-value/utilities";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { getDecimalPrecision } from "./parameters.js";

// ---------------------------------------------------------
// [DATA TYPE CONVERSIONS]
// ---------------------------------------------------------
// https://hl7.org/fhir/r4/search.html#table
// ---------------------------------------------------------

function toStringParameters(value: IMetaValue<NonNullable<unknown>>): string[] {
  switch (value.meta()?.type) {
    // Even though spec states won't encounter this it does. [ImplementationGuide.description]
    case "markdown":
    case "string": {
      return [value.getValue() as string];
    }
    case "HumanName": {
      const humanName = value.getValue() as HumanName;
      return [
        humanName.text ? [humanName.text] : [],
        humanName.family ? [humanName.family] : [],
        humanName.given ? humanName.given : [],
        humanName.prefix ? humanName.prefix : [],
        humanName.suffix ? humanName.suffix : [],
      ].flat();
    }
    case "Address": {
      const address = value.getValue() as Address;
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

async function toTokenParameters(
  value: IMetaValue<NonNullable<unknown>>,
): Promise<Array<{ system?: string; code?: string }>> {
  switch (value.meta()?.type) {
    case "Coding": {
      const coding: Coding = value.getValue() as CodeableConcept;
      return [{ system: coding.system, code: coding.code }];
    }
    case "CodeableConcept": {
      const codings = (
        await Promise.all(
          flatten(value).map(async (v) => flatten(await v.descend("coding"))),
        )
      ).flat() as unknown as IMetaValue<NonNullable<unknown>>[];
      return (await Promise.all(codings.map(toTokenParameters))).flat();
    }
    case "Identifier": {
      const identifier: Identifier = value.getValue() as Identifier;
      return [{ system: identifier.system, code: identifier.value }];
    }
    case "ContactPoint": {
      const contactPoint: ContactPoint = value.getValue() as ContactPoint;
      return [{ code: contactPoint.value }];
    }
    case "code": {
      return [{ code: value.getValue() as string }];
    }
    case "boolean": {
      return [
        {
          system: "http://hl7.org/fhir/special-values",
          code: (value.getValue() as boolean).toString(),
        },
      ];
    }

    case "id":
    case "http://hl7.org/fhirpath/System.String":
    case "string": {
      return [
        {
          code: (value.getValue() as string).toString(),
        },
      ];
    }
    default:
      throw new Error(
        `Unknown token parameter of type '${
          value.meta()?.type
        }' '${value.getValue()}' indexing'`,
      );
  }
}

function toURIParameters(value: IMetaValue<NonNullable<unknown>>): string[] {
  switch (value.meta()?.type) {
    case "uri":
    case "url":
    case "uuid":
    case "canonical": {
      const v: canonical | uri = value.getValue() as canonical | uri;
      return [v];
    }
    default:
      throw new Error(
        `Unknown uri parameter of type '${
          value.meta()?.type
        }' '${value.getValue()}' indexing`,
      );
  }
}

export type ResolveCanonical = <FHIRVersion extends FHIR_VERSION>(
  fhirVersion: FHIRVersion,
  types: ResourceType<FHIRVersion>[],
  url: canonical,
) => Promise<Resource<FHIRVersion, ResourceType<FHIRVersion>> | undefined>;

async function toReferenceRemote<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  parameter: Resource<Version, "SearchParameter">,
  value: IMetaValue<NonNullable<unknown>>,
  resolveCanonical?: ResolveCanonical,
): Promise<
  Array<{
    reference: Reference;
    resourceType?: ResourceType<Version>;
    id?: id;
    url?: canonical | uri;
  }>
> {
  switch (value.meta()?.type) {
    case "Reference": {
      const reference: Reference = value.getValue() as Reference;
      const [resourceType, id] = reference.reference?.split("/") || [];
      if (resourceTypes.has(resourceType) && id) {
        return [
          {
            reference: reference,
            resourceType: resourceType as ResourceType<Version>,
            id: id as id,
          },
        ];
      } else {
        // Need to determine how to handle identifier style references.
        return [];
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
            fhirVersion,
            parameter.target as ResourceType<FHIR_VERSION>[],
            value.getValue().toString() as canonical,
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
          resourceType: resource.resourceType as ResourceType<Version>,
          id: resource.id,
          url: value.getValue() as canonical | uri,
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

async function toDateRange(
  value: IMetaValue<NonNullable<unknown>>,
): Promise<{ start: string; end: string }[]> {
  switch (value.meta()?.type) {
    case "Period": {
      const period: Period = value.getValue() as Period;
      return [
        {
          start: period.start || "-infinity",
          end: period.end || "infinity",
        },
      ];
    }
    case "Timing": {
      const events = (
        await Promise.all(
          flatten(value).map(async (v) => flatten(await v.descend("event"))),
        )
      ).flat() as unknown as IMetaValue<NonNullable<unknown>>[];

      return (await Promise.all(events.map(toDateRange))).flat();
    }
    case "instant": {
      const instant: instant = value.getValue() as instant;
      return [
        {
          start: instant,
          end: instant,
        },
      ];
    }
    case "date": {
      const v: date = value.getValue() as date;
      return [
        {
          start: dayjs(v, "YYYY-MM-DD").toISOString(),
          end: dayjs(v, "YYYY-MM-DD").toISOString(),
        },
      ];
    }
    case "dateTime": {
      const v: dateTime = value.getValue() as dateTime;
      return [{ start: v, end: v }];
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
  value: IMetaValue<NonNullable<unknown>>,
): { start: QuantityIndex; end: QuantityIndex }[] {
  switch (value.meta()?.type) {
    case "Range": {
      const range: Range = value.getValue() as Range;
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
      const quantity: Quantity = value.getValue() as Quantity;
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

async function toCompositeParameters<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  parameter: Resource<Version, "SearchParameter">,
  value: IMetaValue<NonNullable<unknown>>,
  resolveCanonical: ResolveCanonical,
): Promise<ADataConversion<"composite">> {
  const result = await Promise.all(
    (parameter.component ?? []).map(async (part) => {
      const compositeParameter = (await resolveCanonical(
        fhirVersion,
        ["SearchParameter"] as ResourceType<Version>[],
        part.definition,
      )) as Resource<Version, "SearchParameter"> | undefined;

      if (!compositeParameter) {
        throw new OperationError(
          outcomeError(
            "not-found",
            `Composite search parameter '${part.definition}' not found.`,
          ),
        );
      }

      const componentEvaluation = await fp.evaluateWithMeta(
        part.expression,
        value,
      );

      return {
        parameter: compositeParameter,
        result: await dataConversion(
          fhirVersion,
          compositeParameter,
          componentEvaluation,
          resolveCanonical,
        ),
      };
    }),
  );

  return result;
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

  composite: {
    parameter: Resource<FHIR_VERSION, "SearchParameter">;
    result: Awaited<ReturnType<typeof dataConversion>>;
  }[];

  special: never;
};

export type ADataConversion<T extends SEARCH_TYPE> = DATA_CONVERSION[T];

export default async function dataConversion<
  Version extends FHIR_VERSION,
  T extends SEARCH_TYPE,
>(
  fhirVersion: Version,
  parameter: Resource<FHIR_VERSION, "SearchParameter">,
  evaluation: IMetaValue<NonNullable<unknown>>[],
  resolveRemoteCanonical?: ResolveCanonical,
): Promise<ADataConversion<T>[]> {
  const type = parameter.type as unknown as T;
  switch (type) {
    case "composite": {
      if (!resolveRemoteCanonical) {
        throw new OperationError(
          outcomeError(
            "not-supported",
            `Must have resolve present for composite search parameter '${parameter.name}'`,
          ),
        );
      }
      return (await Promise.all(
        evaluation.map(
          (v): Promise<ADataConversion<"composite">> =>
            toCompositeParameters(
              fhirVersion,
              parameter,
              v,
              resolveRemoteCanonical,
            ),
        ),
      )) as ADataConversion<typeof type>[];
    }
    case "number": {
      return evaluation.map((e) => e.getValue()) as ADataConversion<
        typeof type
      >[];
    }
    case "string": {
      return evaluation.map(toStringParameters).flat() as ADataConversion<
        typeof type
      >[];
    }
    case "token": {
      return (
        await Promise.all(evaluation.map(toTokenParameters))
      ).flat() as ADataConversion<typeof type>[];
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
      return (
        await Promise.all(evaluation.map(toDateRange))
      ).flat() as ADataConversion<typeof type>[];
    }
    case "reference": {
      return (
        await Promise.all(
          evaluation.map((v) =>
            toReferenceRemote(
              fhirVersion,
              parameter,
              v,
              resolveRemoteCanonical,
            ),
          ),
        )
      ).flat() as ADataConversion<typeof type>[];
    }
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
