import React from "react";
import { Period } from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { DateTime } from "../primitives/datetime";

export type PeriodEditableProps = EditableProps<Period>;

export const PeriodEditable = ({
  value,
  onChange,
  issue,
  label,
}: PeriodEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <DateTime
          value={value?.start}
          label="Start"
          onChange={(start) => {
            onChange && onChange({ ...value, start });
          }}
        />
        <DateTime
          value={value?.end}
          label="End"
          onChange={(end) => {
            onChange && onChange({ ...value, end });
          }}
        />
      </div>
    </InputContainer>
  );
};
