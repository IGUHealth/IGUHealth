import path from "path";
import { fileURLToPath } from "url";

import {
  uri,
  code,
  StructureDefinition,
  ResourceType,
  Resource,
  SearchParameter,
} from "@iguhealth/fhir-types/lib/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/lib/r4/sets";
import { expect, test } from "@jest/globals";
import { loadArtifacts } from "@iguhealth/artifacts";
import * as fhirpath from "@iguhealth/fhirpath";

function getArtifactResources(resourceTypes: ResourceType[]): Resource[] {
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(
        resourceType,
        path.join(fileURLToPath(import.meta.url), "../../"),
        true
      )
    )
    .flat();

  return artifactResources;
}

const artifactResources = getArtifactResources([
  ...resourceTypes.values(),
] as ResourceType[]);

test.each([...resourceTypes.values()].sort((r, r2) => (r > r2 ? 1 : -1)))(
  `Testing indexing resourceType '%s'`,
  (resourceType) => {
    const searchParameters = artifactResources
      .filter(
        (r): r is SearchParameter =>
          r.resourceType === "SearchParameter" &&
          r.base.includes(resourceType as code)
      )
      // Filtering so only hl7 or remote as these are changing.
      .filter((r) => !r.url.startsWith("https://iguhealth"));
    const resources = artifactResources
      .filter((r) => r.resourceType === resourceType)
      .filter((r) => r.id)
      .sort((r, r2) => JSON.stringify(r).localeCompare(JSON.stringify(r2)))
      .slice(0, 10);
    for (const resource of resources) {
      for (const parameter of searchParameters) {
        if (parameter.expression) {
          try {
            const evalResult = fhirpath.evaluate(
              parameter.expression,
              resource,
              {
                meta: {
                  getSD: (type) => {
                    return artifactResources.find(
                      (r) =>
                        r.resourceType === "StructureDefinition" &&
                        r.type === type
                    ) as StructureDefinition | undefined;
                  },
                },
              }
            );
            expect([parameter.expression, evalResult]).toMatchSnapshot();
          } catch (e) {
            console.error(
              `Expression failed to evaluate ${parameter.expression}`
            );
            console.error(e);
            throw e;
          }
        }
      }
    }
  }
);
