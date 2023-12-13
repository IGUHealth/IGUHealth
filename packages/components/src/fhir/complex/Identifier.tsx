import React from "react";
import { Identifier } from "@iguhealth/fhir-types/r4/types";

import { EditableProps, TerminologyLookupProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRCodeEditable } from "../primitives/code";
import { FHIRUriEditable } from "../primitives/uri";
import { FHIRStringEditable } from "../primitives/string";

export type FHIRIdentifierEditableProps = EditableProps<Identifier> &
  TerminologyLookupProps;

export const FHIRIdentifierEditable = ({
  value,
  expand,
  onChange,
  issue,
  label,
}: FHIRIdentifierEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <FHIRCodeEditable
          expand={expand}
          label="Use"
          open={true}
          system="http://hl7.org/fhir/ValueSet/identifier-use"
          value={value?.use}
          onChange={(use) => {
            onChange?.call(this, { ...value, use });
          }}
        />
        <FHIRUriEditable
          label="System"
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
