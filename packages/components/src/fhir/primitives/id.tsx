import React from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type IdProps = EditableProps<string>;

const idRegex = /^[A-Za-z0-9\-.]{1,64}$/;

export const Id = ({ onChange, value, issue, label }: IdProps) => {
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
        if (onChange) {
          onChange(e.target.value);
        }
      }}
    />
  );
};
