import React, { FC } from "react";

import { LabelContainer } from "../base/labelContainer";

export interface StringProps {
  /**
   * The value of the input.
   */
  value: string;
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
    <LabelContainer label={label} issues={issue ? [issue] : []}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
    </LabelContainer>
  );
};
