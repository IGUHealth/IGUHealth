import React from "react";
import { Address } from "@iguhealth/fhir-types/r4/types";

import { EditableProps } from "../types";
import { InputContainer } from "../../base/containers";
import { FHIRStringEditable } from "../primitives/string";

export type FHIRAddressEditableProps = EditableProps<Address>;

export const FHIRAddressEditable = ({
  value,
  onChange,
  issue,
  label,
}: FHIRAddressEditableProps) => {
  return (
    <InputContainer label={label} issues={issue ? [issue] : []}>
      <div className="flex space-x-1">
        <FHIRStringEditable
          label="Line"
          value={value?.line?.[0] || ""}
          onChange={(line) => {
            line && onChange && onChange({ ...value, line: [line] });
          }}
        />
        <FHIRStringEditable
          label="City"
          value={value?.city || ""}
          onChange={(city) => {
            onChange && onChange({ ...value, city });
          }}
        />
        {/* <String label="District" value={value?.district || ""} /> */}
        <FHIRStringEditable
          label="State"
          value={value?.state || ""}
          onChange={(state) => {
            onChange && onChange({ ...value, state });
          }}
        />
        <FHIRStringEditable
          label="Postal Code"
          value={value?.postalCode || ""}
          onChange={(postalCode) => {
            onChange && onChange({ ...value, postalCode });
          }}
        />
        <FHIRStringEditable
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
