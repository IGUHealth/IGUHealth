import React from "react";

import { uri } from "@iguhealth/fhir-types/r4/types";

import { Input } from "../../base/input";
import { EditableProps } from "../types";

export type FHIRStringEditableProps = EditableProps<uri> & {
  disabled?: boolean;
  inputProps?: Parameters<typeof Input>[0];
};

export const FHIRUriEditable = ({
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
        onChange?.call(this, e.target.value as uri);
      }}
    />
  );
};
