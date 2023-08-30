import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import classNames from "classnames";

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
}

const datetimeRegex =
  /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9]:([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/;

export const DateTime = ({
  onChange,
  value,
  issue,
  outputFormat = "YYYY-MM-DDThh:mm:ss+zz:zz",
}: DateTimeProps) => {
  const [issues, setIssues] = useState<string[]>([]);
  useEffect(() => {
    const issues: string[] = [];
    if (value && !datetimeRegex.test(value)) {
      issues.push(`Invalid date format.`);
    }
    if (issue) issues.push(issue);
    console.log(issues, value);
    setIssues(issues);
  }, [value, issue]);

  return (
    <>
      <input
        type="datetime-local"
        className={classNames("border rounded p-1 text-slate-800", {
          "border-slate-300": issues.length === 0 ? true : false,
          "text-error": issues.length !== 0 ? true : false,
          "border-error": issues.length !== 0 ? true : false,
        })}
        value={dayjs(value).format("YYYY-MM-DDThh:mm:ss")}
        onChange={(e) => {
          if (onChange) {
            const dateString = dayjs(e.target.value).format(outputFormat);
            onChange(dateString);
          }
        }}
      />
      {issues.length !== 0 && (
        <div className="text-sm mt-1 text-error">{issues.join(".")}</div>
      )}
    </>
  );
};
