import React from "react";
import { Identifier, ValueSet } from "@iguhealth/fhir-types/r4/types";

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
          label="use"
          open={true}
          system="http://hl7.org/fhir/ValueSet/identifier-use"
          value={value?.use}
          onChange={(use) => {
            onChange && onChange({ ...value, use });
          }}
        />
        <FHIRUriEditable
          label="system"
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
