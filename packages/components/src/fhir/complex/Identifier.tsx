import React from "react";
import { Identifier } from "@iguhealth/fhir-types/r4/types";

import { InputContainer } from "../../base/labelContainer";
import { Code } from "../primitives/code";
import { Uri } from "../primitives/uri";
import { String } from "../primitives/string";

export interface IdentifierEditableProps {
  /**
   * The value of the input.
   */
  value: Identifier | undefined;
  /**
   * Issues
   */
  issue?: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: Identifier) => void;
  /**
   * Label string.
   */
  label?: string;
}

export const IdentifierEditable = ({
  value,
  onChange,
  issue,
  label,
}: IdentifierEditableProps) => {
  console.log(JSON.stringify(value));
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <Code
          label="use"
          system="http://hl7.org/fhir/ValueSet/identifier-use"
          value={value?.use}
          onChange={(e) => {}}
        />
        <Uri label="system" value={value?.system} onChange={(e) => {}} />
        <String label="value" value={value?.value} onChange={(e) => {}} />
      </div>
    </InputContainer>
  );
};
