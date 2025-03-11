import { canonical, code } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import canonicalMap from "../generated/canonical-map.js";
import searchParameters from "../generated/search-parameters.js";

export function resolveParameterCodeToCanonical<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  resource: (ResourceType<Version> | "Resource" | "DomainResource")[],
  code: code,
): canonical[] {
  const results = [
    ...new Set(
      resource
        .map((r) => canonicalMap[fhirVersion][r]?.[code])
        .filter((c): c is canonical => c !== undefined),
    ),
  ];

  return results;
}

export function resolveInlineSearch<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  canonical: canonical,
): Resource<Version, "SearchParameter"> | undefined {
  const param = searchParameters[fhirVersion]?.[canonical];
  return param as Resource<Version, "SearchParameter"> | undefined;
}

/**
 * Avoid Chicken egg problem this returns all parameters for SearchParameter Resource.
 * @param fhirVersion The FHIR version to get the search parameters for.
 */
export function getAllSearchParameterParameters<Version extends FHIR_VERSION>(
  fhirVersion: Version,
): Resource<Version, "SearchParameter">[] {
  return Object.values(searchParameters[fhirVersion]);
}
