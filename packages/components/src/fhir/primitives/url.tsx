import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";
import { url } from "@iguhealth/fhir-types/r4/types";

export type FHIRStringEditableProps = EditableProps<url> & {
  disabled?: boolean;
  inputProps?: Parameters<typeof Input>[0];
};

export const FHIRUrlEditable = ({
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
        onChange?.call(this, e.target.value as url);
      }}
    />
  );
};
