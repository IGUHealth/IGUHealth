import classNames from "classnames";
import React, {
  MouseEventHandler,
  DetailedHTMLProps,
  InputHTMLAttributes,
  HTMLAttributes,
} from "react";

type ButtonType = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "medium" | "large";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = (props: InputProps) => {
  return <input className="w-full outline-none" {...props} />;
};
