import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import { LabelContainer } from "../../base/labelContainer";
import { Input } from "../../base/input";

export interface DateTimeProps {
  /**
   * String datetime value.
   */
  value?: string;
  /**
   * onChange returns datetime string based on outputFormat.
   */
  onChange: (value: string) => void;
  /**
   * Error issue string.
   */
  issue?: string;
  /**
   * String output format defaults to YYYY-MM-DDThh:mm:ss+zz:zz.
   */
  outputFormat?: string;
  /**
   * Label string.
   */
  label?: string;
}

const datetimeRegex =
  /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/;

export const DateTime = ({
  onChange,
  value,
  issue,
  outputFormat = "YYYY-MM-DDThh:mm:ssZ",
  label,
}: DateTimeProps) => {
  const [issues, setIssues] = useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value && !datetimeRegex.test(value)) {
      issues.push(`Invalid date format`);
    }
    if (issue) issues.push(issue);
    setIssues(issues);
  }, [value, issue]);

  return (
    <LabelContainer label={label} issues={issues}>
      <Input
        type="datetime-local"
        value={dayjs(value).format("YYYY-MM-DDThh:mm:ss")}
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
