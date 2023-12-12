import React, { useEffect } from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type PositiveIntegerProps = EditableProps<number>;

export const PositiveInteger = ({
  value,
  onChange,
  issue,
  label,
}: PositiveIntegerProps) => {
  const [issues, setIssues] = React.useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value !== undefined && value <= 0) {
      issues.push(`Invalid value: positive integers must be greater 0`);
    }
    if (issue) issues.push(issue);
    setIssues(issues);
  }, [value, issue]);

  return (
    <Input
      label={label}
      issues={issues}
      type="number"
      min="0"
      value={value ? Math.round(value) : value}
      step="0.1"
      onChange={(e) => {
        const value = parseInt(e.target.value);
        if (value <= 0 && onChange) onChange(1);
        if (onChange && !isNaN(value)) {
          onChange(value);
        }
      }}
    />
  );
};
