import classNames from "classnames";
import React, {
  MouseEventHandler,
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";

type ButtonType = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: React.ReactNode;
  size?: ButtonSize;
  type?: ButtonType;
}

function btnTypeClass(type: ButtonType) {
  switch (type) {
    case "primary":
      return "btn-primary";
    case "secondary":
      return "btn-secondary";
    case "danger":
      return "btn-error";
  }
}

function btnSize(size: ButtonSize) {
  switch (size) {
    case "small":
      return "text-xs";
    case "medium":
      return "text-base";
    case "large":
      return "text-lg";
  }
}

export const Button = (props: ButtonProps) => {
  const { onClick, label, type = "primary", size = "medium" } = props;
  return (
    <div
      onClick={onClick}
      {...props}
      className={classNames(
        "btn",
        btnTypeClass(type),
        btnSize(size),
        props.className
      )}
    >
      {label}
    </div>
  );
};
