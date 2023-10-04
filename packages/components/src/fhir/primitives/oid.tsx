import React, { useEffect, useState } from "react";

import { InputContainer } from "../../base/labelContainer";
import { Input } from "../../base/input";

type OID = `urn:oid:${string}`;

export interface OIDProps {
  /**
   * The value of the input.
   */
  value: OID;
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

const oidRegex = /^urn:oid:[0-2](\.(0|[1-9][0-9]*))+$/;

export const OID = ({ onChange, value, issue, label }: OIDProps) => {
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const issues: string[] = [];
    if (value && !oidRegex.test(value)) {
      issues.push(`Invalid oid format`);
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
