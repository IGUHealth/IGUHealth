import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type FHIRIdEditableProps = EditableProps<string>;

const idRegex = /^[A-Za-z0-9\-.]{1,64}$/;

export const FHIRIdEditable = ({
  onChange,
  value,
  issue,
  label,
}: FHIRIdEditableProps) => {
  const [issues, setIssues] = React.useState<string[]>([]);
  React.useEffect(() => {
    const issues: string[] = [];
    if (value && !idRegex.test(value)) {
      issues.push(`Id is in an invalid format`);
    }
    if (issue) issues.push(issue);
    setIssues(issues);
  }, [value, issue]);

  return (
    <Input
      label={label}
      issues={issues}
      type="text"
      value={value}
      onChange={(e) => {
        onChange?.call(this, e.target.value);
      }}
    />
  );
};
