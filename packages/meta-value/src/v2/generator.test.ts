import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { StructureDefinition } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";

import { generateMetaData } from "./generator.js";

const sds: StructureDefinition[] = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
});

test("Generate R4 Patient", async () => {
  expect(
    generateMetaData(sds.filter((sd) => sd.type === "Patient")),
  ).toMatchSnapshot();
});

test("Generate R4 Questionnaire", async () => {
  expect(
    generateMetaData(sds.filter((sd) => sd.type === "Questionnaire")),
  ).toMatchSnapshot();
});
