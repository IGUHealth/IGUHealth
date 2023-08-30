import React, { FC } from "react";
import classNames from "classnames";

export interface StringProps {
  /**
   * The value of the input.
   */
  value: string;
  /**
   * The value of the input.
   */
  error?: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: string) => void;
}

export const String = ({ onChange, value, error }: StringProps) => {
  return (
    <>
      <input
        className={classNames("border", "rounded", "p-1", "text-slate-800", {
          "border-slate-300": error ? false : true,
          "border-error": error ? true : false,
        })}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
      {error && <div className="text-sm mt-1 text-error">{error}</div>}
    </>
  );
};
