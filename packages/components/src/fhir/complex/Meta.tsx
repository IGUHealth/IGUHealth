import React from "react";
import { Meta } from "@iguhealth/fhir-types/r4/types";
import { String } from "../primitives/string";

export interface MetaReadonlyProps {
  value: Meta | undefined;
}

export const MetaReadOnly = ({ value }: MetaReadonlyProps) => {
  return (
    <div className="p-1 flex space-x-1">
      <String
        value={value?.versionId}
        inputProps={{ readOnly: true }}
        label="Version ID"
      />
      <String
        value={value?.lastUpdated}
        inputProps={{ readOnly: true }}
        label="Last Updated"
      />
    </div>
  );
};
