import React from "react";

import { Quantity } from "@iguhealth/fhir-types/r4/types";

export type FHIRQuantityReadOnlyProps = {
  value: Quantity;
};

export const FHIRQuantityReadOnly = ({ value }: FHIRQuantityReadOnlyProps) => {
  return (
    <div className="flex flex-1 space-x-1">
      <div>{value.value}</div>
      <div>{value.unit}</div>
    </div>
  );
};
