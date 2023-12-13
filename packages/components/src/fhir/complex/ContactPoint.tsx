import React from "react";
import { ContactPoint } from "@iguhealth/fhir-types/r4/types";

import { EditableProps, ClientProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRCodeEditable } from "../primitives/code";
import { FHIRStringEditable } from "../primitives/string";

export type FHIRContactPointEditableProps = EditableProps<ContactPoint> &
  ClientProps;

export const FHIRContactPointEditable = ({
  value,
  client,
  onChange,
  issue,
  label,
}: FHIRContactPointEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <FHIRCodeEditable
          label="Use"
          client={client}
          open={true}
          system="http://hl7.org/fhir/ValueSet/contact-point-use"
          value={value?.use}
          onChange={(use) => {
            onChange?.call(this, { ...value, use });
          }}
        />
        <FHIRCodeEditable
          label="System"
          client={client}
          open={true}
          system="http://hl7.org/fhir/ValueSet/contact-point-system"
          value={value?.system}
          onChange={(system) => {
            onChange?.call(this, { ...value, system });
          }}
        />
        <FHIRStringEditable
          label="Value"
          value={value?.value}
          onChange={(v) => {
            onChange?.call(this, { ...value, value: v });
          }}
        />
      </div>
    </InputContainer>
  );
};
