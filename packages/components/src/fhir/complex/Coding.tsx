import React from "react";
import { Coding } from "@iguhealth/fhir-types/r4/types";

import { EditableProps, ClientProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRCodeEditable, FHIRUriEditable } from "../primitives";

export type FHIRCodingEditableProps = EditableProps<Coding> & ClientProps;

export const FHIRCodingEditable = ({
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
            system && onChange?.call(this, { ...value, system });
          }}
        />
        <FHIRCodeEditable
          label="Code"
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
