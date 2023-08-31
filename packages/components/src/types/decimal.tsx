import React from "react";
import { LabelContainer } from "../base/labelContainer";

export interface DecimalProps {
  value?: number;
  onChange: (value: number) => void;
  issue?: string;
  label?: string;
}

export const Decimal = ({ value, onChange, issue, label }: DecimalProps) => {
  return (
    <LabelContainer label={label} issues={issue ? [issue] : []}>
      <input
        className="outline-none"
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
    </LabelContainer>
  );
};
