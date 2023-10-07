import React from "react";

import { Input } from "../../base/input";

export interface DecimalProps {
  value?: number;
  onChange: (value: number) => void;
  issue?: string;
  label?: string;
}

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
