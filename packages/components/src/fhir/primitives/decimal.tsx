import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";
import { decimal } from "@iguhealth/fhir-types/r4/types";

export type FHIRDecimalEditableProps = EditableProps<decimal>;

export const FHIRDecimalEditable = ({
  value,
  onChange,
  issue,
  label,
}: FHIRDecimalEditableProps) => {
  return (
    <Input
      label={label}
      issues={issue ? [issue] : []}
      type="number"
      value={value}
      step="0.1"
      onChange={(e) => {
        const value = parseFloat(e.target.value);
        if (onChange && !isNaN(value)) {
          onChange(value as decimal);
        }
      }}
    />
  );
};
