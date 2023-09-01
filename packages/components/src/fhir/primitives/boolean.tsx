import React from "react";
import { LabelContainer } from "../../base/labelContainer";

export interface BooleanProps {
  value?: boolean;
  onChange: (value: boolean) => void;
  issue?: string;
  label?: string;
}

export const Boolean = ({ value, onChange, label, issue }: BooleanProps) => {
  return (
    <LabelContainer
      inlineLabel={true}
      label={label}
      issues={issue ? [issue] : []}
    >
      <input
        className="outline-none"
        type="checkbox"
        checked={value}
        onChange={(e) => {
          console.log(e.target.checked);
        }}
      />
    </LabelContainer>
  );
};
