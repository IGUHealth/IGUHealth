import React from "react";
import { Identifier, ValueSet } from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { Code } from "../primitives/code";
import { Uri } from "../primitives/uri";
import { String } from "../primitives/string";

export type IdentifierEditableProps = EditableProps<Identifier> & {
  expand?: (value: string) => Promise<ValueSet>;
};

export const IdentifierEditable = ({
  value,
  expand,
  onChange,
  issue,
  label,
}: IdentifierEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <Code
          expand={expand}
          label="use"
          open={true}
          system="http://hl7.org/fhir/ValueSet/identifier-use"
          value={value?.use}
          onChange={(use) => {
            onChange && onChange({ ...value, use });
          }}
        />
        <Uri
          label="system"
          value={value?.system}
          onChange={(system) => {
            onChange && onChange({ ...value, system });
          }}
        />
        <String
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
