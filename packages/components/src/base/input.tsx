import classNames from "classnames";
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  HTMLProps,
} from "react";
import {
  inputClassNames,
  ContainerProps,
  DisplayIssues,
  Label,
} from "./containers";

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  issues?: string[];
  hideBorder?: boolean;
  labelProps?: HTMLProps<HTMLLabelElement>;
  label?: string;
}

export const Input = (props: InputProps) => {
  const {
    label,
    labelProps,
    hideBorder = false,
    issues = [],
    ...inputProps
  } = props;
  return (
    <div className="flex flex-col flex-grow">
      <Label
        {...labelProps}
        label={label}
        className={classNames("mr-1 ", labelProps?.className)}
      />
      <input
        {...inputProps}
        className={classNames(
          "w-full outline-none",
          inputClassNames({ hideBorder, issues }),
          inputProps?.className
        )}
      />
      <DisplayIssues issues={issues} />
    </div>
  );
};
