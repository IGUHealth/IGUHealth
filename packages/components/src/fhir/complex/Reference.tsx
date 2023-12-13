import React from "react";
import { Reference } from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRStringEditable, FHIRDecimalEditable } from "../primitives";

export type FHIRSimpleQuantityEditableProps = EditableProps<Reference>;

export const FHIRReferenceEditable = ({
  value,
  onChange,
  issue,
  label,
}: FHIRSimpleQuantityEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        
      </div>
    </InputContainer>
  );
};
