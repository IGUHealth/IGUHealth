import React from "react";
import { Ratio } from "@iguhealth/fhir-types/r4/types";

import { EditableProps, ClientProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRSimpleQuantityEditable } from "./SimpleQuantity";

export type FHIRRatioEditableProps = EditableProps<Ratio>;

export const FHIRRatioEditable = ({
  value,
  onChange,
  issue,
  label,
}: FHIRRatioEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex flex-1 space-x-1">
        <FHIRSimpleQuantityEditable
          label="Numerator"
          value={value?.numerator}
          onChange={(numerator) => {
            onChange?.call(this, { ...value, numerator });
          }}
        />
        <FHIRSimpleQuantityEditable
          label="Denominator"
          value={value?.denominator}
          onChange={(denominator) => {
            onChange?.call(this, { ...value, denominator });
          }}
        />
      </div>
    </InputContainer>
  );
};
