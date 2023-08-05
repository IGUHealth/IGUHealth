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
  (v) =>
    v !== "CodeSystem" &&
    v !== "ValueSet" &&
    v !== "StructureDefinition" &&
    v !== "SearchParameter"
);

async function loadTestData() {
  const promises = [];
  for (let i = 0; i < 30; i++) {
    for (const resourceType of resourceTypesToCheck) {
      const resources = loadArtifacts(
        resourceType,
        path.join(fileURLToPath(import.meta.url), "../../"),
        true
      );

      for (const resource of resources) {
        try {
          promises.push(await client.create(resourceType, resource));
        } catch (e) {
          console.error(JSON.stringify(e));
          console.error(JSON.stringify(resource, null, 2));
          throw e;
        }
      }
    }
  }
  console.log(promises.length);
  await Promise.all(promises);
  console.log("DONE", promises.length);
}

await loadTestData();
