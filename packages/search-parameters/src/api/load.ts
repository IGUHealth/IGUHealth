import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";

export function loadParameters<Version extends FHIR_VERSION>(
  fhirVersion: Version,
): Resource<Version, "SearchParameter">[] {
  return loadArtifacts({
    fhirVersion,
    silence: true,
    resourceType: "SearchParameter",
    currentDirectory: fileURLToPath(import.meta.url),
    onlyPackages: [
      "@iguhealth/iguhealth.fhir.r4.core",
      "@iguhealth/iguhealth.fhir.r4b.core",
      "@iguhealth/hl7.fhir.r4.core",
      "@iguhealth/hl7.fhir.r4b.core",
    ],
  });
}
