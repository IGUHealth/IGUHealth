import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type DecimalProps = EditableProps<number>;

export const Decimal = ({ value, onChange, issue, label }: DecimalProps) => {
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
          onChange(value);
        }
      }}
    />
  );
};
