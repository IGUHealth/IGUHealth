import React from "react";

import { Coding } from "@iguhealth/fhir-types/r4/types";

import { InputContainer } from "../../base/containers";
import { FHIRCodeEditable, FHIRUriEditable } from "../primitives";
import { ClientProps, EditableProps } from "../types";

export type FHIRCodingEditableProps = EditableProps<Coding> & ClientProps;

export const FHIRCodingEditable = ({
  fhirVersion,
  value,
  onChange,
  client,
  issue,
  label,
}: FHIRCodingEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex flex-1 space-x-1">
        <FHIRUriEditable
          label="System"
          value={value?.system}
          onChange={(system) => {
            system && onChange?.call(this, { ...value, system: system });
          }}
        />
        <FHIRCodeEditable
          label="Code"
          fhirVersion={fhirVersion}
          client={client}
          open={true}
          system={value?.system}
          value={value?.code}
          onChange={(code) => {
            onChange?.call(this, { ...value, code });
          }}
        />
      </div>
    </InputContainer>
  );
};
