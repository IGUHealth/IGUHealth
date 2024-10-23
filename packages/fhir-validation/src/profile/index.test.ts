import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { R4 } from "@iguhealth/fhir-types/versions";
import { expect, test } from "@jest/globals";

const sd = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../.."),
  silence: true,
  onlyPackages: ["hl7.fhir.us.core"],
});

test("Testing", () => {
  expect(sd.map((s) => s.id)).toMatchSnapshot();
});
