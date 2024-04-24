import { createRequire } from "node:module";

import { Bundle } from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  FHIR_VERSION,
  VersionedAResource,
  VersionedResourceType,
} from "@iguhealth/fhir-types/versions";

import { IndexFile, PackageJSON } from "./types.js";

function isBundle(r: unknown): r is Bundle | r4b.Bundle {
  return (r as Record<string, unknown>)?.resourceType === "Bundle";
}

function isType<
  Version extends FHIR_VERSION,
  T extends VersionedResourceType<Version>,
>(
  _fhirVersion: Version,
  type: T,
  r: unknown,
): r is VersionedAResource<Version, T> {
  return (
    r !== undefined && (r as Record<string, unknown>)?.resourceType === type
  );
}

function flattenOrInclude<
  Version extends FHIR_VERSION,
  T extends VersionedResourceType<Version>,
>(
  fhirVersion: Version,
  type: T,
  resource: unknown,
): VersionedAResource<Version, T>[] {
  if (isBundle(resource)) {
    const resources = (resource.entry || [])?.map((entry) => entry.resource);
    return resources.filter((r: unknown): r is VersionedAResource<Version, T> =>
      isType(fhirVersion, type, r),
    );
  }
  if (isType(fhirVersion, type, resource)) {
    return [resource];
  }
  return [];
}

/**
 * Interface used to search dependencies for .index.json files and load their contents.
 * @param options Artifact Load options
 * @returns A list of resources of type T
 */
export default function loadArtifacts<
  Version extends FHIR_VERSION,
  T extends VersionedResourceType<Version>,
>({
  fhirVersion,
  resourceType,
  packageLocation,
  silence,
  onlyPackages,
}: {
  // Only support R4 and R4B for now.
  fhirVersion: Version;
  resourceType: T;
  packageLocation: string;
  silence?: boolean;
  onlyPackages?: string[];
}): VersionedAResource<Version, T>[] {
  const requirer = createRequire(packageLocation);
  const packageJSON: PackageJSON = requirer("./package.json");

  let deps = { ...packageJSON.dependencies };
  // https://jestjs.io/docs/environment-variables
  // JEST sets environment to test by default.
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    deps = { ...packageJSON.devDependencies, ...deps };
  }

  return Object.keys(deps || {})
    .filter((d) => {
      try {
        const depPackage = requirer(`${d}/package.json`);
        // Filter according to onlyPackages if provided.
        if (onlyPackages && !onlyPackages.includes(d)) {
          return false;
        }

        // Filter out for packages that contain a fhirVersion specified by parameter.
        return depPackage.fhirVersions?.some((version: string) =>
          version.startsWith(fhirVersion),
        );
      } catch (e) {
        return false;
      }
    })
    .map((d) => {
      try {
        if (!silence)
          console.log(
            ` '${d}' Loading package contents from .index.json for resourceType '${resourceType}'`,
          );
        const indexFile: IndexFile | undefined = requirer(`${d}/.index.json`);
        if (indexFile?.files) {
          const fileInfos = resourceType
            ? indexFile.files.filter(
                (metaInfo) =>
                  metaInfo.resourceType &&
                  resourceType === metaInfo.resourceType,
              )
            : indexFile.files;
          return fileInfos
            .map((r) => {
              return flattenOrInclude(
                fhirVersion,
                resourceType,
                requirer(`${d}/${r.filename}`),
              );
            })
            .flat();
        }
        return [];
      } catch (e) {
        console.error(e);
        return [];
      }
    })
    .flat();
}
