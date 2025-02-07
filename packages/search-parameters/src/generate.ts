import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { R4, R4B, Resource } from "@iguhealth/fhir-types/versions";

const r4SearchParameters: Resource<R4, "SearchParameter">[] = loadArtifacts({
  resourceType: "SearchParameter",
  fhirVersion: R4,
  silence: true,
  currentDirectory: fileURLToPath(import.meta.url),
});

const r4bSearchParameters: Resource<R4B, "SearchParameter">[] = loadArtifacts({
  resourceType: "SearchParameter",
  fhirVersion: R4B,
  silence: true,
  currentDirectory: fileURLToPath(import.meta.url),
});
