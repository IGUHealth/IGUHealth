import React, { HTMLProps } from "react";
import classNames from "classnames";

interface LabelContainerProps {
  children: React.ReactNode;
  issues?: string[];
  label?: string;
  inlineLabel?: boolean;
  disabled?: boolean;
  hideBorder?: boolean;
  labelProps?: HTMLProps<HTMLLabelElement>;
}

export const inputClassNames = ({
  hideBorder,
  issues,
}: {
  hideBorder: boolean;
  issues: string[];
}) =>
  classNames(
    "relative",
    "px-3 py-2",
    { "border shadow-sm": !hideBorder },
    "bg-white  placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200",
    "focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1",
    "invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 disabled:shadow-none",
    {
      "border-slate-300": issues.length === 0 ? true : false,
      "text-pink-500": issues.length !== 0 ? true : false,
      "border-pink-500": issues.length !== 0 ? true : false,
    }
  );

export const DisplayIssues = ({ issues }: { issues: string[] }) => {
  return (
    issues.length !== 0 && (
      <div className="text-sm mt-1 text-pink-600">{issues.join(".\n")}</div>
    )
  );
};

interface LabelProps extends HTMLProps<HTMLLabelElement> {
  label?: string;
}

export const Label = (props: LabelProps) =>
  props.label && <label {...props}>{props.label}</label>;

export const InputContainer = ({
  children,
  issues = [],
  label,
  inlineLabel = false,
  hideBorder = false,
  disabled = false,
  labelProps,
}: LabelContainerProps) => (
  <div
    className={classNames("flex-grow", {
      "flex flex-row items-center justify-center": inlineLabel,
    })}
  >
    <Label
      {...labelProps}
      label={label}
      className={classNames("mr-1", labelProps?.className)}
    />

    <div className={inputClassNames({ hideBorder, issues })}>{children}</div>
    <DisplayIssues issues={issues} />
  </div>
);
