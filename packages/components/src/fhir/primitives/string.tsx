import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type FHIRStringEditableProps = EditableProps<string> & {
  disabled?: boolean;
  inputProps?: Parameters<typeof Input>[0];
};

export const FHIRStringEditable = ({
  onChange,
  value,
  issue,
  label,
  disabled = false,
  inputProps,
}: FHIRStringEditableProps) => {
  return (
    <Input
      {...inputProps}
      disabled={disabled}
      label={label}
      issues={issue ? [issue] : []}
      type="text"
      value={value}
      onChange={(e) => {
        onChange?.call(this, e.target.value);
      }}
    />
  );
};
