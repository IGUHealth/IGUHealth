import classNames from "classnames";
import React, { MouseEventHandler } from "react";

type ButtonType = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  label: string;
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

export const Button = ({
  onClick,
  label,
  type = "primary",
  size = "medium",
}: ButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames("btn", btnTypeClass(type), btnSize(size))}
    >
      {label}
    </div>
  );
};
