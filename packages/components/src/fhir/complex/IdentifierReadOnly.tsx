import React from "react";

import { Identifier } from "@iguhealth/fhir-types/r4/types";

export type FHIRIdentifierReadOnlyProps = {
  value: Identifier;
};

export const FHIRIdentifierReadOnly = ({
  value,
}: FHIRIdentifierReadOnlyProps) => {
  return (
    <div className="flex flex-1 space-x-1">
      <div>{value?.system}</div>
      <div>{value?.value}</div>
      <div>{value?.type?.text}</div>
    </div>
  );
};
