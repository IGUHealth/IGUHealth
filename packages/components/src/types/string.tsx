import React, { FC } from "react";

export interface StringProps {
  /**
   * The value of the input.
   */
  value: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: string) => void;
}

export const String = ({ onChange, value }: StringProps) => {
  return (
    <input
      className="border rounded p-1 border-slate-300 text-slate-800"
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
    />
  );
};
