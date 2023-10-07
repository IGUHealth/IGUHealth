import React, { useEffect, useState } from "react";

import { InputContainer } from "../../base/containers";
import { Input } from "../../base/input";

type UUID = `${string}-${string}-${string}-${string}`;

export interface UUIDProps {
  /**
   * The value of the input.
   */
  value: UUID;
  /**
   * The value of the input.
   */
  issue?: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: string) => void;
  /**
   * Label string.
   */
  label?: string;
}

const uuidRegex =
  /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/;

export const UUID = ({ onChange, value, issue, label }: UUIDProps) => {
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
    <InputContainer label={label} issues={issues}>
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
    </InputContainer>
  );
};
