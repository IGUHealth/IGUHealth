import React from "react";
import { ContactPoint, ValueSet } from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRCodeEditable } from "../primitives/code";
import { FHIRStringEditable } from "../primitives/string";

export type FHIRContactPointEditableProps = EditableProps<ContactPoint> & {
  expand?: (value: string) => Promise<ValueSet>;
};

export const FHIRContactPointEditable = ({
  value,
  expand,
  onChange,
  issue,
  label,
}: FHIRContactPointEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <FHIRCodeEditable
          label="use"
          expand={expand}
          open={true}
          system="http://hl7.org/fhir/ValueSet/contact-point-use"
          value={value?.use}
          onChange={(use) => {
            onChange && onChange({ ...value, use });
          }}
        />
        <FHIRCodeEditable
          label="system"
          expand={expand}
          open={true}
          system="http://hl7.org/fhir/ValueSet/contact-point-system"
          value={value?.system}
          onChange={(system) => {
            onChange && onChange({ ...value, system });
          }}
        />
        <FHIRStringEditable
          label="value"
          value={value?.value}
          onChange={(v) => {
            onChange && onChange({ ...value, value: v });
          }}
        />
      </div>
    </InputContainer>
  );
};
