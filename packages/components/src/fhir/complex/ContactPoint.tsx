import React from "react";
import { ContactPoint, ValueSet } from "@iguhealth/fhir-types/r4/types";

import { InputContainer } from "../../base/containers";
import { Code } from "../primitives/code";
import { Uri } from "../primitives/uri";
import { String } from "../primitives/string";

export interface ContactPointEditableProps {
  /**
   * The value of the input.
   */
  value: ContactPoint | undefined;

  expand?: (value: string) => Promise<ValueSet>;
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
  expand,
  onChange,
  issue,
  label,
}: ContactPointEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <Code
          label="use"
          expand={expand}
          open={true}
          system="http://hl7.org/fhir/ValueSet/contact-point-use"
          value={value?.use}
          onChange={(use) => {
            onChange && onChange({ ...value, use });
          }}
        />
        <Code
          label="system"
          expand={expand}
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
