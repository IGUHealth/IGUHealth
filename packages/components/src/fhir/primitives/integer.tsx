import React from "react";
import { InputContainer } from "../../base/labelContainer";
import { Input } from "../../base/input";

export interface IntegerProps {
  value?: number;
  onChange: (value: number) => void;
  issue?: string;
  label?: string;
}

export const Integer = ({ value, onChange, issue, label }: IntegerProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <Input
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
    </InputContainer>
  );
};
