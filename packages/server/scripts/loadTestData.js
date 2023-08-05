import path from "node:path";
import { fileURLToPath } from "url";

import createHTTPClient from "@iguhealth/client/lib/http/index.js";
import { loadArtifacts } from "@iguhealth/artifacts";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";

const client = createHTTPClient({
  token: "fake",
  url: "http://localhost:3000/w/1704fc63-dd53-4d6c-8435-1a4b83ba27f7/api/v1/fhir/r4",
});

const resourceTypesToCheck = [...resourceTypes].filter(
  (v) => v !== "CodeSystem" && v !== "ValueSet"
);

async function loadTestData() {
  for (const resourceType of resourceTypesToCheck) {
    const resources = loadArtifacts(
      resourceType,
      path.join(fileURLToPath(import.meta.url), "../../"),
      true
    );

    for (const resource of resources) {
      await client.create(resourceType, resource);
    }
  }
}

await loadTestData();
