import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type FHIRBooleanEditableProps = EditableProps<boolean>;

export const FHIRBooleanEditable = ({
  value,
  onChange,
  label,
  issue,
}: FHIRBooleanEditableProps) => {
  return (
    <div className="inline-block">
      <Input
        hideBorder
        label={label}
        issues={issue ? [issue] : []}
        type="checkbox"
        checked={value}
        onChange={(e) => {
          onChange && onChange(e.target.checked);
        }}
      />
    </div>
  );
};
