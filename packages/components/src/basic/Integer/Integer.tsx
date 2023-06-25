import React, { FC } from "react";
import locale from "antd/locale/en_US";
import { ConfigProvider, InputNumber } from "antd";
import type { integer } from "@genfhi/fhir-types/r4/types";

type Props = FhirWidgetProps<integer>;

export const Integer: FC<Props> = ({ value, onChange }) => {
  const handleChange = (inputValue: number | null) => {
    onChange?.(inputValue ?? undefined);
  };

  return (
    <ConfigProvider locale={locale}>
      <style>{`
        .input__integer {
          width: 10em;
        }
      `}</style>
      <InputNumber
        className="input__integer"
        status={Number.isNaN(value) ? "error" : ""}
        value={value}
        onChange={handleChange}
        placeholder="Input an integer"
        maxLength={16}
      />
    </ConfigProvider>
  );
};
