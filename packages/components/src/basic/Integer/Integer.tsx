import React, { FC } from "react";
import { InputNumber } from "antd";
import type { integer } from "@genfhi/fhir-types/r4/types";

type Props = FhirWidgetProps<integer>;

export const Integer: FC<Props> = ({ value, onChange }) => {
  const handleChange = (inputValue: number | null) => {
    onChange?.(inputValue ?? undefined);
  };

  return (
    <InputNumber
      className="Fhir__Integer"
      status={Number.isNaN(value) ? "error" : ""}
      value={value}
      onChange={handleChange}
      placeholder="Input an integer"
      maxLength={16}
    />
  );
};
