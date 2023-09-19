import React, { useState, useEffect } from "react";

import classNames from "classnames";
import { InputContainer } from "../../base/labelContainer";
import { Input } from "../../base/input";

export interface TimeProps {
  /**
   * String time value.
   */
  value?: string;
  /**
   * onChange returns time string based on outputFormat.
   */
  onChange: (value: string) => void;
  /**
   * Error issue string.
   */
  issue?: string;
  /**
   * Label string.
   */
  label?: string;
}

const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/;

export const Time = ({ onChange, value, issue, label }: TimeProps) => {
  const [issues, setIssues] = useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value && !timeRegex.test(value)) {
      issues.push(`Invalid date format`);
    }
    if (issue) issues.push(issue);

    setIssues(issues);
  }, [value, issue]);

  return (
    <InputContainer label={label} issues={issues}>
      <Input
        step="1"
        type="time"
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
