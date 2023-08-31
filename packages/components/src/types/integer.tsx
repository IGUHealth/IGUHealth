import React from "react";
import { LabelContainer } from "../base/labelContainer";

export interface IntegerProps {
  value?: number;
  onChange: (value: number) => void;
  issue?: string;
  label?: string;
}

export const Integer = ({ value, onChange, issue, label }: IntegerProps) => {
  return (
    <LabelContainer label={label} issues={issue ? [issue] : []}>
      <input
        className="outline-none"
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
    </LabelContainer>
  );
};
