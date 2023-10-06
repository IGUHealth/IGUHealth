import React from "react";
import { ContactPoint } from "@iguhealth/fhir-types/r4/types";

import { InputContainer } from "../../base/labelContainer";
import { Code } from "../primitives/code";
import { Uri } from "../primitives/uri";
import { String } from "../primitives/string";

export interface ContactPointEditableProps {
  /**
   * The value of the input.
   */
  value: ContactPoint | undefined;
  /**
   * Issues
   */
  issue?: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: ContactPoint) => void;
  /**
   * Label string.
   */
  label?: string;
}

export const ContactPointEditable = ({
  value,
  onChange,
  issue,
  label,
}: ContactPointEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <Code
          label="use"
          open={true}
          system="http://hl7.org/fhir/ValueSet/contact-point-use"
          value={value?.use}
          onChange={(use) => {
            onChange && onChange({ ...value, use });
          }}
        />
        <Code
          label="system"
          open={true}
          system="http://hl7.org/fhir/ValueSet/contact-point-system"
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
