import React from "react";

import { Input } from "../../base/input";

export interface BooleanProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  issue?: string;
  label?: string;
}

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
          onChange(e.target.checked);
        }}
      />
    </div>
  );
};
