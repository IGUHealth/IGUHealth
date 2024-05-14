import React from "react";

import { CodeableConcept } from "@iguhealth/fhir-types/r4/types";

import { FHIRCodingReadOnly } from "./CodingReadOnly";

export type FHIRCodeableConceptReadOnlyProps = {
  value: CodeableConcept;
};

export const FHIRCodeableConceptReadOnly = ({
  value,
}: FHIRCodeableConceptReadOnlyProps) => {
  return (
    <div className="flex flex-1 space-x-1">
      <div>{value?.text}</div>
      {value?.coding?.map((coding, index) => (
        <div className="mr-1">
          <FHIRCodingReadOnly key={index} value={coding} />
        </div>
      ))}
    </div>
  );
};
