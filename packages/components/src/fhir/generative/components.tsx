/* eslint @typescript-eslint/no-explicit-any: 0 */
import React from "react";
import {
  Address,
  Annotation,
  Attachment,
  CodeableConcept,
  Coding,
  ContactDetail,
  ContactPoint,
  HumanName,
  Identifier,
  Period,
  Quantity,
  Range,
  Ratio,
  Reference,
  ResourceType,
  code,
  date,
  dateTime,
  decimal,
  integer,
  uri,
  url,
} from "@iguhealth/fhir-types/r4/types";

import * as ComplexTypes from "../complex";
import * as Primitives from "../primitives";

import { getElementDefinition } from "./helpers";
import { MetaProps } from "./types";

type TypeProps = MetaProps<any, any> & {
  label?: string;
};
type TypeComponent = React.FC<TypeProps>;

type SharedProps<T> = {
  label?: string;
  value?: T;
  onChange: (v: T | undefined) => void;
};

function deriveSharedProps<T>(props: TypeProps): SharedProps<T> {
  return {
    label: props.label,
    value: props.value as T | undefined,
    onChange: (v: T | undefined) => {
      props.onChange({
        op: "replace",
        path: props.pointer,
        value: v,
      });
    },
  };
}

export const TypeComponents: Record<string, TypeComponent> = {
  "http://hl7.org/fhirpath/System.String": (props) => (
    <Primitives.FHIRStringEditable
      disabled={true}
      {...deriveSharedProps<string>(props)}
    />
  ),
  string: (props) => (
    <Primitives.FHIRStringEditable {...deriveSharedProps<string>(props)} />
  ),
  boolean: (props) => (
    <Primitives.FHIRBooleanEditable {...deriveSharedProps<boolean>(props)} />
  ),
  url: (props) => (
    <Primitives.FHIRUrlEditable {...deriveSharedProps<url>(props)} />
  ),
  date: (props) => (
    <Primitives.FHIRDateEditable {...deriveSharedProps<date>(props)} />
  ),
  dateTime: (props) => (
    <Primitives.FHIRDateTimeEditable {...deriveSharedProps<dateTime>(props)} />
  ),
  uri: (props) => (
    <Primitives.FHIRUriEditable {...deriveSharedProps<uri>(props)} />
  ),
  code: (props) => (
    <Primitives.FHIRCodeEditable
      {...deriveSharedProps<code>(props)}
      client={props.client}
      open={true}
      system={
        getElementDefinition(props.sd, props.elementIndex).element.binding
          ?.valueSet
      }
    />
  ),
  decimal: (props) => (
    <Primitives.FHIRDecimalEditable {...deriveSharedProps<decimal>(props)} />
  ),
  integer: (props) => (
    <Primitives.FHIRIntegerEditable {...deriveSharedProps<integer>(props)} />
  ),
  Address: (props) => (
    <ComplexTypes.FHIRAddressEditable {...deriveSharedProps<Address>(props)} />
  ),
  Annotation: (props) => (
    <ComplexTypes.FHIRAnnotationEditable
      {...deriveSharedProps<Annotation>(props)}
    />
  ),
  Identifier: (props) => (
    <ComplexTypes.FHIRIdentifierEditable
      {...deriveSharedProps<Identifier>(props)}
      client={props.client}
    />
  ),
  ContactPoint: (props) => (
    <ComplexTypes.FHIRContactPointEditable
      {...deriveSharedProps<ContactPoint>(props)}
      client={props.client}
    />
  ),
  HumanName: (props) => (
    <ComplexTypes.FHIRHumanNameEditable
      {...deriveSharedProps<HumanName>(props)}
    />
  ),
  ContactDetail: (props) => (
    <ComplexTypes.FHIRContactDetailEditable
      {...deriveSharedProps<ContactDetail>(props)}
      client={props.client}
    />
  ),

  Period: (props) => (
    <ComplexTypes.FHIRPeriodEditable {...deriveSharedProps<Period>(props)} />
  ),
  Quantity: (props) => (
    <ComplexTypes.FHIRSimpleQuantityEditable
      value={props.value as Quantity}
      label={props.label}
      onChange={(v) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  Reference: (props) => (
    <ComplexTypes.FHIRReferenceEditable
      {...deriveSharedProps<Reference>(props)}
      client={props.client}
      resourceTypesAllowed={getElementDefinition(
        props.sd,
        props.elementIndex
      ).element.type?.[0]?.targetProfile?.map((tp) => {
        const parts = tp.split("/");
        return parts[parts.length - 1] as ResourceType;
      })}
    />
  ),
  Ratio: (props) => (
    <ComplexTypes.FHIRRatioEditable {...deriveSharedProps<Ratio>(props)} />
  ),
  Range: (props) => (
    <ComplexTypes.FHIRRangeEditable {...deriveSharedProps<Range>(props)} />
  ),
  CodeableConcept: (props) => (
    <ComplexTypes.FhirCodeableConceptEditable
      {...deriveSharedProps<CodeableConcept>(props)}
      client={props.client}
    />
  ),
  Coding: (props) => (
    <ComplexTypes.FHIRCodingEditable
      client={props.client}
      {...deriveSharedProps<Coding>(props)}
    />
  ),
  Attachment: (props) => (
    <ComplexTypes.FHIRAttachmentEditable
      {...deriveSharedProps<Attachment>(props)}
    />
  ),
};

export const isTypeRenderingSupported = (type: string) => {
  return Object.keys(TypeComponents).includes(type);
};
