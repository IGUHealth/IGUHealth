import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import classNames from "classnames";

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
   * String output format defaults to hh:mm:ss.
   */
  outputFormat?: string;
}

const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?$/;

export const Time = ({
  onChange,
  value,
  issue,
  outputFormat = "hh:mm:ss",
}: TimeProps) => {
  const [issues, setIssues] = useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value && !timeRegex.test(value)) {
      issues.push(`Invalid date format.`);
    }
    if (issue) issues.push(issue);

    setIssues(issues);
  }, [value, issue]);

  return (
    <>
      <input
        step="1"
        type="time"
        className={classNames("border rounded p-1 text-slate-800", {
          "border-slate-300": issues.length === 0 ? true : false,
          "text-error": issues.length !== 0 ? true : false,
          "border-error": issues.length !== 0 ? true : false,
        })}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
      {issues.length !== 0 && (
        <div className="text-sm mt-1 text-error">{issues.join(".")}</div>
      )}
    </>
  );
};
