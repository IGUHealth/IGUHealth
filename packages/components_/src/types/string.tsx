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
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      }}
    />
  );
};
