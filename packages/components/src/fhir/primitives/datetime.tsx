import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import { EditableProps } from "../types";
import { Input } from "../../base/input";

export type DateTimeProps = EditableProps<string> & {
  /**
   * String output format defaults to YYYY-MM-DDThh:mm:ssZ.
   */
  outputFormat?: string;
};

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
    <Input
      label={label}
      issues={issues}
      type="datetime-local"
      value={dayjs(value).format("YYYY-MM-DDThh:mm:ss")}
      onChange={(e) => {
        if (onChange) {
          const dateString = dayjs(e.target.value).format(outputFormat);
          onChange(dateString);
        }
      }}
    />
  );
};
