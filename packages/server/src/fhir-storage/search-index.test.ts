import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { resourceTypes } from "@iguhealth/fhir-types/lib/generated/r4/sets";
import {
  Resource,
  ResourceType,
  SearchParameter,
  StructureDefinition,
  code,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  VersionedAResource,
  VersionedResourceType,
} from "@iguhealth/fhir-types/lib/versions";
import * as fhirpath from "@iguhealth/fhirpath";

function getArtifactResources<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  resourceTypes: VersionedResourceType<Version>[],
): VersionedAResource<Version, AllResourceTypes>[] {
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        fhirVersion,
        resourceType,
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
        // silence: true,
        // Limiting to strictly hl7 packages as iguhealth packages changing constantly for snapshots.
        onlyPackages: [
          "@iguhealth/hl7.fhir.r4.core",
          "@iguhealth/hl7.fhir.r4b.core",
          "@iguhealth/hl7.fhir.r4.test-data",
        ],
        silence: true,
      }),
    )
    .flat();

  return artifactResources as VersionedAResource<Version, AllResourceTypes>[];
}

const r4ArtifactResources = getArtifactResources(R4, [
  ...resourceTypes.values(),
] as ResourceType[]);

test.each([...resourceTypes.values()].sort((r, r2) => (r > r2 ? 1 : -1)))(
  `R4 Testing indexing resourceType '%s'`,
  (resourceType) => {
    const searchParameters = r4ArtifactResources.filter(
      (r): r is SearchParameter =>
        r.resourceType === "SearchParameter" &&
        r.base.includes(resourceType as code),
    );

    const resources = r4ArtifactResources
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
                  fhirVersion: R4,
                  getSD: (fhirVersion, type) => {
                    return r4ArtifactResources.find(
                      (r) =>
                        r.resourceType === "StructureDefinition" &&
                        r.type === type,
                    ) as StructureDefinition | undefined;
                  },
                },
              },
            );
            expect([parameter.expression, evalResult]).toMatchSnapshot();
          } catch (e) {
            console.error(
              `Expression failed to evaluate ${parameter.expression}`,
            );
            console.error(e);
            throw e;
          }
        }
      }
    }
  },
);
