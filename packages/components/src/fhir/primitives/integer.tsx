import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type FHIRIntegerEditableProps = EditableProps<number>;

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
          onChange(value);
        }
      }}
    />
  );
};
