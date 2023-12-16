import React from "react";
import {
  Address,
  Annotation,
  ContactDetail,
  ContactPoint,
  HumanName,
  Identifier,
  Period,
  Quantity,
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

import { MetaProps } from "./types";

type TypeProps = MetaProps<any, any> & {
  label?: string;
};
type TypeComponent = React.FC<TypeProps>;

export const TypeComponents: Record<string, TypeComponent> = {
  "http://hl7.org/fhirpath/System.String": (props) => (
    <Primitives.FHIRStringEditable
      disabled={true}
      label={props.label}
      value={props.value as string}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  string: (props) => (
    <Primitives.FHIRStringEditable
      value={props.value as string}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  boolean: (props) => (
    <Primitives.FHIRBooleanEditable
      value={props.value as boolean}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  url: (props) => (
    <Primitives.FHIRUrlEditable
      value={props.value as url}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  date: (props) => (
    <Primitives.FHIRDateEditable
      value={props.value as date}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  dateTime: (props) => (
    <Primitives.FHIRDateTimeEditable
      value={props.value as dateTime}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  uri: (props) => (
    <Primitives.FHIRUriEditable
      value={props.value as uri}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  code: (props) => (
    <Primitives.FHIRCodeEditable
      client={props.client}
      value={props.value as code}
      label={props.label}
      open={true}
      system={props.sd.snapshot?.element[props.elementIndex].binding?.valueSet}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  decimal: (props) => (
    <Primitives.FHIRDecimalEditable
      value={props.value as decimal}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  integer: (props) => (
    <Primitives.FHIRIntegerEditable
      value={props.value as integer}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  Address: (props) => (
    <ComplexTypes.FHIRAddressEditable
      value={props.value as Address}
      label={props.label}
      onChange={(v: Address | undefined) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  Annotation: (props) => (
    <ComplexTypes.FHIRAnnotationEditable
      value={props.value as Annotation}
      label={props.label}
      onChange={(v: Annotation | undefined) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  Identifier: (props) => (
    <ComplexTypes.FHIRIdentifierEditable
      client={props.client}
      value={props.value as Identifier}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  ContactPoint: (props) => (
    <ComplexTypes.FHIRContactPointEditable
      client={props.client}
      value={props.value as ContactPoint}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  HumanName: (props) => (
    <ComplexTypes.FHIRHumanNameEditable
      value={props.value as HumanName}
      label={props.label}
      onChange={(v: unknown) => {
        props.onChange({
          op: "replace",
          path: props.pointer,
          value: v,
        });
      }}
    />
  ),
  ContactDetail: (props) => (
    <ComplexTypes.FHIRContactDetailEditable
      value={props.value as ContactDetail}
      client={props.client}
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
  Period: (props) => (
    <ComplexTypes.FHIRPeriodEditable
      value={props.value as Period}
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
      client={props.client}
      resourceTypesAllowed={props.sd.snapshot?.element[
        props.elementIndex
      ].type?.[0]?.targetProfile?.map((tp) => {
        const parts = tp.split("/");
        return parts[parts.length - 1] as ResourceType;
      })}
      value={props.value as Reference}
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
};

export const isTypeRenderingSupported = (type: string) => {
  return Object.keys(TypeComponents).includes(type);
};
