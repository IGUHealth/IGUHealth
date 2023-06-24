import React, { FC, useEffect, useRef, useState } from "react";
import locale from "antd/locale/en_US";
import { ConfigProvider, Input } from "antd";
import type { integer } from "@genfhi/fhir-types/r4/types";
import { useTemporaryError } from "../../hooks";

type Props = FhirWidgetProps<integer>;

export const Integer: FC<Props> = ({ value: controlledValue, onChange }) => {
  const [value, setValue] = useState<string | undefined>(
    controlledValue?.toString()
  );
  const lastControlledValue = useRef(controlledValue);
  const [hasTemporaryError, flashTemporaryError] = useTemporaryError()

  useEffect(() => {
    if (controlledValue !== lastControlledValue.current) {
      // Edge detected in controlledValue, trigger state change
      lastControlledValue.current = controlledValue;

      setValue(controlledValue?.toString() ?? "");
    }
  }, [controlledValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.trim();

    const reg = /^-?\d+$/;
    if (reg.test(inputValue)) {
      setValue(inputValue);
    } else if (inputValue === "" || inputValue === "-") {
      setValue(inputValue);
    } else {
      // Pasted decimal value, e.g.
      flashTemporaryError()
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    let strValue = value ?? "";
    strValue = strValue.trim();
    if (strValue === "-") {
      strValue = strValue.slice(0, -1);
    }
    const num = Number.parseInt(strValue, 10);
    if (strValue === "" || Number.isNaN(num)) {
      setValue("");
      onChange?.(undefined);
    } else {
      setValue(strValue);
      onChange?.(num);
    }
  };

  return (
    <ConfigProvider locale={locale}>
      <Input
        status={(Number.isNaN(value) || hasTemporaryError) ? "error" : ""}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Input an integer"
        maxLength={16}
      />
    </ConfigProvider>
  );
};
