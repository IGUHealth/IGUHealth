import React from "react";

import { HumanName } from "@iguhealth/fhir-types/r4/types";

export type FHIRHumanNameReadOnlyProps = {
  value: HumanName;
};

export const FHIRHumanNameReadOnly = ({
  value,
}: FHIRHumanNameReadOnlyProps) => {
  return (
    <div className="flex flex-1 space-x-1">
      {value.text ? (
        value.text
      ) : (
        <>
          <div>{value?.prefix?.join(" ")}</div>
          <div>{value?.text}</div>
          <div>{value?.given?.join(" ")}</div>
          <div>{value?.family}</div>
          <div>{value?.suffix?.join(" ")}</div>
        </>
      )}
    </div>
  );
};
