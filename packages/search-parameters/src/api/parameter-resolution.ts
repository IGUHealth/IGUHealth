import { canonical, code } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, ResourceType } from "@iguhealth/fhir-types/versions";

import canonicalMap from "../generated/canonical-map.js";

export default function resolveCanonical<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  resource: (ResourceType<Version> | "Resource" | "DomainResource")[],
  code: code,
): canonical | undefined {
  const results = [
    ...new Set(
      resource
        .map((r) => canonicalMap[fhirVersion][r]?.[code])
        .filter((c): c is canonical => c !== undefined),
    ),
  ];

  if (results.length > 1) {
    throw new Error(`Multiple canonicals found for ${code} in ${resource}`);
  }

  return results[0];
}
