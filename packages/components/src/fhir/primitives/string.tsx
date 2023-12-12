import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type StringProps = EditableProps<string> & {
  disabled?: boolean;
  inputProps?: Parameters<typeof Input>[0];
};

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
