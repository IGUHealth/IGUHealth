import React from "react";

import { LabelContainer } from "../../base/labelContainer";
import { Input } from "../../base/input";

export interface IdProps {
  /**
   * The value of the input.
   */
  value: string;
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

const idRegex = /^[A-Za-z0-9\-\.]{1,64}$/;

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
    <LabelContainer label={label} issues={issues}>
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
    </LabelContainer>
  );
};
