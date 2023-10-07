import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import { Input } from "../../base/input";

export interface DateTimeProps {
  /**
   * String instant value.
   */
  value?: string;
  /**
   * onChange returns instant string.
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

const instantRegex =
  /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))$/;

export const Instant = ({ onChange, value, issue, label }: DateTimeProps) => {
  const [issues, setIssues] = useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value && !instantRegex.test(value)) {
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
      value={dayjs(value, "YYYY-MM-DDThh:mm:ss.SSSZ").format(
        "YYYY-MM-DDThh:mm:ss.SSS"
      )}
      onChange={(e) => {
        if (onChange) {
          const dateString = dayjs(e.target.value).format(
            "YYYY-MM-DDThh:mm:ss.SSSZ"
          );
          onChange(dateString);
        }
      }}
    />
  );
};
