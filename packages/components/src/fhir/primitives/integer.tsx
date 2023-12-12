import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type IntegerProps = EditableProps<number>;

export const Integer = ({ value, onChange, issue, label }: IntegerProps) => {
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
