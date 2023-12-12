import React from "react";
import { Address } from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { String } from "../primitives/string";

export type AddressEditableProps = EditableProps<Address>;

export const AddressEditable = ({
  value,
  onChange,
  issue,
  label,
}: AddressEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <String
          label="Line"
          value={value?.line?.[0] || ""}
          onChange={(line) => {
            onChange && onChange({ ...value, line: [line] });
          }}
        />
        <String
          label="City"
          value={value?.city || ""}
          onChange={(city) => {
            onChange && onChange({ ...value, city });
          }}
        />
        {/* <String label="District" value={value?.district || ""} /> */}
        <String
          label="State"
          value={value?.state || ""}
          onChange={(state) => {
            onChange && onChange({ ...value, state });
          }}
        />
        <String
          label="Postal Code"
          value={value?.postalCode || ""}
          onChange={(postalCode) => {
            onChange && onChange({ ...value, postalCode });
          }}
        />
        <String
          label="Country"
          value={value?.country || ""}
          onChange={(country) => {
            onChange && onChange({ ...value, country });
          }}
        />
      </div>
    </InputContainer>
  );
};
