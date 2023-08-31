import React from "react";

export interface CodeProps {
  value?: string;
  onChange: (value: string) => void;
  issue?: string;
  label?: string;
  system?: string;
}

export const Code = ({ value, onChange, issue, label, system }: CodeProps) => {
  return <input />;
};
