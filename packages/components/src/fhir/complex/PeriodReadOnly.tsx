import React from "react";

import { Period } from "@iguhealth/fhir-types/r4/types";

export type FHIRPeriodReadOnlyProps = {
  value: Period;
};

export const FHIRPeriodReadOnly = ({ value }: FHIRPeriodReadOnlyProps) => {
  return (
    <div className="flex flex-1 space-x-1">
      <div>
        {value.start ?? "any time"} <span>{"->"}</span>{" "}
      </div>
      <div>{value.end ?? "any time"}</div>
    </div>
  );
};
