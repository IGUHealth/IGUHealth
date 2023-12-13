import React from "react";
import { Quantity } from "@iguhealth/fhir-types/r4/types";

import { EditableProps, TerminologyLookupProps } from "../types";
import { InputContainer } from "../../base/containers";
import {
  FHIRStringEditable,
  FHIRCodeEditable,
  FHIRDecimalEditable,
} from "../primitives";

export type FHIRQuantityEditableProps = EditableProps<Quantity> &
  TerminologyLookupProps;

export const FHIRQuantityEditable = ({
  value,
  onChange,
  issue,
  label,
  expand,
}: FHIRQuantityEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <FHIRCodeEditable
          expand={expand}
          label="Comparator"
          open={true}
          system="http://hl7.org/fhir/ValueSet/quantity-comparator"
          value={value?.comparator}
          onChange={(comparator) => {
            onChange?.call(this, { ...value, comparator });
          }}
        />
        <FHIRDecimalEditable
          label="Value"
          value={value?.value}
          onChange={(valueDec) => {
            onChange?.call(this, { ...value, value: valueDec });
          }}
        />
        <FHIRStringEditable
          label="Unit"
          value={value?.unit}
          onChange={(unit) => {
            onChange?.call(this, { ...value, unit });
          }}
        />
      </div>
    </InputContainer>
  );
};
