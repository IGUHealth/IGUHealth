import React, { FC } from "react";

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

  disabled?: boolean;

  inputProps?: Parameters<typeof Input>[0];
}

export const String = ({
  onChange,
  value,
  issue,
  label,
  disabled = false,
  inputProps,
}: StringProps) => {
  return (
    <Input
      {...inputProps}
      disabled={disabled}
      label={label}
      issues={issue ? [issue] : []}
      type="text"
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
    />
  );
};
