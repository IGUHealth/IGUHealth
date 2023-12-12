import React, { useEffect, useState } from "react";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

type UUID = `${string}-${string}-${string}-${string}`;

export type FHIRUUIDEditableProps = EditableProps<UUID>;

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function isUUID(value: string): value is UUID {
  return uuidRegex.test(value);
}

export const FHIRUUIDEditable = ({
  onChange,
  value,
  issue,
  label,
}: FHIRUUIDEditableProps) => {
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const issues: string[] = [];
    if (value && !uuidRegex.test(value)) {
      issues.push(`Invalid uuid format`);
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
        const value = e.target.value;
        if (onChange) {
          onChange(value as UUID);
        }
      }}
    />
  );
};
