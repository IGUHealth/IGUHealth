import React, { HTMLProps } from "react";
import classNames from "classnames";

interface LabelContainerProps {
  children: React.ReactNode;
  issues?: string[];
  label?: string;
  inlineLabel?: boolean;
  labelProps?: HTMLProps<HTMLLabelElement>;
}

export const LabelContainer = ({
  children,
  issues = [],
  label,
  inlineLabel = false,
  labelProps,
}: LabelContainerProps) => (
  <div
    className={classNames({
      "flex flex-row items-center justify-center": inlineLabel,
    })}
  >
    <label {...labelProps} className="mr-1">
      {label}
    </label>

    <div
      className={classNames(
        "focus-within:border-blue-800",
        "focus-within:shadow-md",
        "border rounded p-1 text-slate-800",
        {
          "border-slate-700": issues.length === 0 ? true : false,
          "text-error": issues.length !== 0 ? true : false,
          "border-error": issues.length !== 0 ? true : false,
        }
      )}
    >
      {children}
    </div>
    {issues.length !== 0 && (
      <div className="text-sm mt-1 text-error">{issues.join(".\n")}</div>
    )}
  </div>
);
