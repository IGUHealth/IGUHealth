import React, { useEffect } from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type UnsignedIntegerProps = EditableProps<number>;

export const UnsignedInteger = ({
  value,
  onChange,
  issue,
  label,
}: UnsignedIntegerProps) => {
  const [issues, setIssues] = React.useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value !== undefined && value < 0) {
      issues.push(
        `Invalid value: unsigned integers must be greater than or equal to 0`
      );
    }
    if (issue) issues.push(issue);
    console.log(issues);
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
        if (value < 0 && onChange) onChange(0);
        if (onChange && !isNaN(value)) {
          onChange(value);
        }
      }}
    />
  );
};
