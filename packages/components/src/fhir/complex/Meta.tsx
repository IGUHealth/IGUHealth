import React from "react";
import { Meta } from "@iguhealth/fhir-types/r4/types";
import { FHIRStringEditable } from "../primitives/string";

export interface FHIRMetaReadonlyProps {
  value: Meta | undefined;
}

export const FHIRMetaReadOnly = ({ value }: FHIRMetaReadonlyProps) => {
  return (
    <div className="p-1 flex space-x-1">
      <FHIRStringEditable
        value={value?.versionId}
        disabled={true}
        label="Version ID"
      />
      <FHIRStringEditable
        value={value?.lastUpdated}
        disabled={true}
        label="Last Updated"
      />
    </div>
  );
};
