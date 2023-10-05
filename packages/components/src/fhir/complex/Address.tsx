import React from "react";
import { Address } from "@iguhealth/fhir-types/r4/types";

import { InputContainer } from "../../base/labelContainer";
import { String } from "../primitives/string";

export interface AddressEditableProps {
  /**
   * The value of the input.
   */
  value: Address;
  /**
   * Issues
   */
  issue?: string;
  /**
   * Call back triggered when input changes.
   */
  onChange?: (value: string) => void;
  /**
   * Label string.
   */
  label?: string;
}

export const AddressEditable = ({
  value,
  onChange,
  issue,
  label,
}: AddressEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <String label="Line" value={value.line?.[0] || ""} />
        <String label="City" value={value.city || ""} />
        <String label="City" value={value.city || ""} />
        <String label="District" value={value.district || ""} />
        <String label="State" value={value.state || ""} />
        <String label="Postal Code" value={value.postalCode || ""} />
        <String label="Country" value={value.country || ""} />
      </div>
    </InputContainer>
  );
};
