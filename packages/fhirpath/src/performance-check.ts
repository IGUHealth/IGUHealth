import path from "node:path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { R4 } from "@iguhealth/fhir-types/versions";

import { parse as parseV1 } from "./parser.js";
import parseV2 from "./parserv2/index.js";

const searchParameters = loadArtifacts({
  fhirVersion: R4,
  resourceType: "SearchParameter",
  loadDevelopmentPackages: true,
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
}).filter((s) => s.expression);

console.time("v1");
for (let i = 0; i < 1000; i++) {
  for (const parameter of searchParameters) {
    parseV1(parameter.expression as string);
  }
}
console.timeEnd("v1");

console.time("v2");
for (let i = 0; i < 1000; i++) {
  for (const parameter of searchParameters) {
    parseV2(parameter.expression as string);
  }
}
console.timeEnd("v2");
