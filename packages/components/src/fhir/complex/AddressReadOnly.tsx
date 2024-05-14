import React from "react";

import { Address } from "@iguhealth/fhir-types/r4/types";

export type FHIRAddressReadonlyProps = {
  value: Address;
};

export const FHIRAddressReadOnly = ({ value }: FHIRAddressReadonlyProps) => {
  return (
    <div className="flex flex-1 space-x-1">
      <div>{value?.line?.[0]}</div>
      <div>{value?.city}</div>
      <div>{value?.state}</div>
      <div>{value?.postalCode}</div>
      <div>{value?.country}</div>
    </div>
  );
};
