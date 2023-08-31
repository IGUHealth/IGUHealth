import React from "react";

import { LabelContainer } from "../base/labelContainer";

export interface UrlProps {
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

export const Url = ({ onChange, value, issue, label }: UrlProps) => {
  return (
    <LabelContainer label={label} issues={issue ? [issue] : []}>
      <input
        className="outline-none"
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
