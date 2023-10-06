import React from "react";
import { InputContainer } from "../../base/labelContainer";
import { Input } from "../../base/input";

export interface BooleanProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  issue?: string;
  label?: string;
}

export const Boolean = ({ value, onChange, label, issue }: BooleanProps) => {
  return (
    <InputContainer
      inlineLabel={false}
      label={label}
      issues={issue ? [issue] : []}
    >
      <Input
        type="checkbox"
        checked={value}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
      />
    </InputContainer>
  );
};
