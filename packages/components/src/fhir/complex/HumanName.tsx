import React from "react";
import { HumanName } from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { String } from "../primitives/string";

export type HumanNameEditableProps = EditableProps<HumanName>;

export const HumanNameEditable = ({
  value,
  onChange,
  issue,
  label,
}: HumanNameEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <String
          label="First"
          value={value?.given?.[0] || ""}
          onChange={(firstName) => {
            const given = value?.given ? [...value.given] : [];
            given[0] = firstName;
            onChange && onChange({ ...value, given });
          }}
        />
        <String
          label="Middle"
          value={value?.given?.[1] || ""}
          onChange={(middleName) => {
            const given = value?.given ? [...value.given] : [];
            if (!given[0]) given[0] = "";
            given[1] = middleName;
            onChange && onChange({ ...value, given });
          }}
        />
        <String
          label="Last"
          value={value?.family}
          onChange={(family) => {
            onChange && onChange({ ...value, family });
          }}
        />
      </div>
    </InputContainer>
  );
};
