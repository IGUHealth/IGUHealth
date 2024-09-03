import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import * as r4Sets from "@iguhealth/fhir-types/lib/generated/r4/sets";
import {
  StructureDefinition,
  canonical,
  code,
  uri,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import * as r4bSets from "@iguhealth/fhir-types/lib/generated/r4b/sets";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/lib/versions";
import * as fhirpath from "@iguhealth/fhirpath";

function getArtifactResources<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
): Resource<Version, AllResourceTypes>[] {
  const artifactResources = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        fhirVersion,
        loadDevelopmentPackages: true,
        resourceType,
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
        // Limiting to strictly hl7 packages as iguhealth packages changing constantly for snapshots.
        onlyPackages: [
          "@iguhealth/hl7.fhir.r4.core",
          "@iguhealth/hl7.fhir.r4b.core",
          "@iguhealth/hl7.fhir.r4.test-data",
          "@iguhealth/hl7.fhir.r4b.test-data",
        ],
        silence: true,
      }),
    )
    .flat();

  return artifactResources as Resource<Version, AllResourceTypes>[];
}

const r4ArtifactResources = getArtifactResources(R4, [
  ...r4Sets.resourceTypes.values(),
] as ResourceType<R4>[]);

async function resolveTypeToCanonical(
  _fhirVersion: FHIR_VERSION,
  type: uri,
): Promise<canonical | undefined> {
  const sd = r4ArtifactResources.find(
    (resource) =>
      resource.resourceType === "StructureDefinition" && resource.type === type,
  );

  return (sd as StructureDefinition)?.url as canonical;
}

async function resolveCanonical<
  Version extends FHIR_VERSION,
  Type extends AllResourceTypes,
>(
  fhirVersion: Version,
  type: Type,
  url: canonical,
): Promise<Resource<Version, Type> | undefined> {
  const foundSD = r4ArtifactResources.find(
    (resource) =>
      resource.resourceType === "StructureDefinition" && resource.url === url,
  );

  return foundSD as Resource<Version, Type> | undefined;
}

test.each(
  [...r4Sets.resourceTypes.values()].sort((r, r2) => (r > r2 ? 1 : -1)),
)(`R4 Testing indexing resourceType '%s'`, async (resourceType) => {
  const searchParameters = r4ArtifactResources.filter(
    (r): r is Resource<R4, "SearchParameter"> =>
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
          const evalResult = await fhirpath.evaluate(
            parameter.expression,
            resource,
            {
              meta: {
                fhirVersion: R4,
                resolveCanonical,
                resolveTypeToCanonical,
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
});

const r4bArtifactResources = getArtifactResources(R4B, [
  ...r4bSets.resourceTypes.values(),
] as ResourceType<R4B>[]);

test.each(
  [...r4bSets.resourceTypes.values()].sort((r, r2) => (r > r2 ? 1 : -1)),
)(`R4B Testing indexing resourceType '%s'`, async (resourceType) => {
  const searchParameters = r4bArtifactResources.filter(
    (r): r is Resource<R4B, "SearchParameter"> =>
      r.resourceType === "SearchParameter" &&
      r.base.includes(resourceType as code),
  );

  const resources = r4bArtifactResources
    .filter((r) => r.resourceType === resourceType)
    .filter((r) => r.id)
    .sort((r, r2) => JSON.stringify(r).localeCompare(JSON.stringify(r2)))
    .slice(0, 10);

  for (const resource of resources) {
    for (const parameter of searchParameters) {
      if (parameter.expression) {
        try {
          const evalResult = await fhirpath.evaluate(
            parameter.expression,
            resource,
            {
              meta: {
                fhirVersion: R4B,
                resolveCanonical,
                resolveTypeToCanonical,
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
});
