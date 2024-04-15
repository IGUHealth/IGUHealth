import { createRequire } from "node:module";

import {
  AResource,
  Bundle,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/r4/types";

import { IndexFile, PackageJSON } from "./types.js";

function isBundle(r: Resource): r is Bundle {
  return r?.resourceType === "Bundle";
}

function isType<T extends ResourceType>(
  type: T,
  r: Resource | undefined,
): r is AResource<T> {
  return r !== undefined && r.resourceType === type;
}

function flattenOrInclude<T extends ResourceType>(
  type: T,
  resource: Resource,
): AResource<T>[] {
  if (isBundle(resource)) {
    const resources = (resource.entry || [])?.map((entry) => entry.resource);
    return resources.filter((r: Resource | undefined): r is AResource<T> =>
      isType(type, r),
    );
  }
  if (isType(type, resource)) {
    return [resource];
  }
  return [];
}

interface LoadArtifactOptions<T extends ResourceType> {
  // Only support R4 and R4B for now.
  fhirVersion?: "4.0" | "4.3";
  resourceType: T;
  packageLocation: string;
  silence?: boolean;
  onlyPackages?: string[];
}

/**
 * Interface used to search dependencies for .index.json files and load their contents.
 * @param options Artifact Load options
 * @returns A list of resources of type T
 */
export default function loadArtifacts<T extends ResourceType>({
  fhirVersion = "4.0",
  resourceType,
  packageLocation,
  silence,
  onlyPackages,
}: LoadArtifactOptions<T>): AResource<T>[] {
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
        return !!depPackage.fhirVersions;
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
