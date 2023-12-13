import React from "react";
import { ContactDetail } from "@iguhealth/fhir-types/r4/types";

import { EditableProps, TerminologyLookupProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRStringEditable, FHIRCodeEditable } from "../primitives";

export type FHIRContactDetailEditableProps = EditableProps<ContactDetail> &
  TerminologyLookupProps;

export const FHIRContactDetailEditable = ({
  value,
  onChange,
  expand,
  issue,
  label,
}: FHIRContactDetailEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <FHIRStringEditable
          label="Name"
          value={value?.name}
          onChange={(name) => {
            name && onChange?.call(this, { ...value, name });
          }}
        />
        <FHIRCodeEditable
          label="System"
          expand={expand}
          open={true}
          system="http://hl7.org/fhir/ValueSet/contact-point-system"
          value={value?.telecom?.[0]?.system}
          onChange={(telecomSystem) => {
            onChange?.call(this, {
              ...value,
              telecom: [{ ...value?.telecom?.[0], system: telecomSystem }],
            });
          }}
        />
        <FHIRStringEditable
          label="Value"
          value={value?.telecom?.[0]?.value}
          onChange={(telecomValue) => {
            telecomValue &&
              onChange?.call(this, {
                ...value,
                telecom: [{ ...value?.telecom?.[0], value: telecomValue }],
              });
          }}
        />
      </div>
    </InputContainer>
  );
};
