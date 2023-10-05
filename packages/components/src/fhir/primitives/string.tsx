import React, { FC } from "react";

import { InputContainer } from "../../base/labelContainer";
import { Input } from "../../base/input";

export interface StringProps {
  /**
   * The value of the input.
   */
  value: string | undefined;
  /**
   * The value of the input.
   */
  issue?: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: string) => void;
  /**
   * Label string.
   */
  label?: string;
}

export const String = ({ onChange, value, issue, label }: StringProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
    </InputContainer>
  );
};
