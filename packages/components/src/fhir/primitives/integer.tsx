import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";
import { integer } from "@iguhealth/fhir-types/r4/types";

export type FHIRIntegerEditableProps = EditableProps<integer>;

export const FHIRIntegerEditable = ({
  value,
  onChange,
  issue,
  label,
}: FHIRIntegerEditableProps) => {
  return (
    <Input
      label={label}
      issues={issue ? [issue] : []}
      type="number"
      value={value ? Math.round(value) : value}
      step="0.1"
      onChange={(e) => {
        const value = parseInt(e.target.value);
        if (onChange && !isNaN(value)) {
          onChange(value as integer);
        }
      }}
    />
  );
};
