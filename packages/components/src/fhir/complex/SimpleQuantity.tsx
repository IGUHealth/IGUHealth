import React from "react";
import { Quantity } from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRStringEditable, FHIRDecimalEditable } from "../primitives";

export type FHIRSimpleQuantityEditableProps = EditableProps<Quantity>;

export const FHIRSimpleQuantityEditable = ({
  value,
  onChange,
  issue,
  label,
}: FHIRSimpleQuantityEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex flex-1 space-x-1">
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
