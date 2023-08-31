import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import { LabelContainer } from "../base/labelContainer";

export interface DateProps {
  /**
   * String date value.
   */
  value?: string;
  /**
   * onChange returns date string based on outputFormat.
   */
  onChange: (value: string) => void;
  /**
   * Error issue string.
   */
  issue?: string;
  /**
   * String output format defaults to YYYY-MM-DD.
   */
  outputFormat?: string;
  /**
   * Label string.
   */
  label?: string;
}

const dateRegex =
  /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?)?$/;

export const Date = ({
  onChange,
  value,
  issue,
  label,
  outputFormat = "YYYY-MM-DD",
}: DateProps) => {
  const [issues, setIssues] = useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value && !dateRegex.test(value)) {
      issues.push(`Invalid date format`);
    }
    if (issue) issues.push(issue);

    setIssues(issues);
  }, [value, issue]);

  return (
    <LabelContainer label={label} issues={issues}>
      <input
        className="outline-none"
        type="date"
        value={dayjs(value).format("YYYY-MM-DD")}
        onChange={(e) => {
          if (onChange) {
            const dateString = dayjs(e.target.value).format(outputFormat);
            onChange(dateString);
          }
        }}
      />
    </LabelContainer>
  );
};
