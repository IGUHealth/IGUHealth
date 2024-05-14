import React from "react";

import { Coding } from "@iguhealth/fhir-types/r4/types";

export type FHIRCodingReadOnlyProps = {
  value: Coding;
};

function FHIRCodingDetailDisplay({ value }: FHIRCodingReadOnlyProps) {
  return (
    <div>
      <span>
        [{value.system ? `${value.system}:` : ""} {value.code}]
      </span>
    </div>
  );
}

export const FHIRCodingReadOnly = ({ value }: FHIRCodingReadOnlyProps) => {
  return (
    <>
      {value.display ? (
        value.display
      ) : (
        <FHIRCodingDetailDisplay value={value} />
      )}
    </>
  );
};
