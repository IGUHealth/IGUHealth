import React from "react";

import { Reference } from "@iguhealth/fhir-types/r4/types";

export type FHIRReferenceReadOnlyProps = {
  value: Reference;
};

export const FHIRReferenceReadOnly = ({
  value,
}: FHIRReferenceReadOnlyProps) => {
  return <div>{value.display ?? value.reference}</div>;
};
