import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type BooleanProps = EditableProps<boolean>;

export const Boolean = ({ value, onChange, label, issue }: BooleanProps) => {
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
