import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { Bundle } from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import { IndexFile, PackageJSON } from "./types.js";

function isBundle(r: unknown): r is Bundle | r4b.Bundle {
  return (r as Record<string, unknown>)?.resourceType === "Bundle";
}

function isType<Version extends FHIR_VERSION, T extends ResourceType<Version>>(
  _fhirVersion: Version,
  type: T,
  r: unknown,
): r is Resource<Version, T> {
  return (
    r !== undefined && (r as Record<string, unknown>)?.resourceType === type
  );
}

function flattenOrInclude<
  Version extends FHIR_VERSION,
  T extends ResourceType<Version>,
>(fhirVersion: Version, type: T, resource: unknown): Resource<Version, T>[] {
  if (isBundle(resource)) {
    const resources = (resource.entry || [])?.map((entry) => entry.resource);
    return resources.filter((r: unknown): r is Resource<Version, T> =>
      isType(fhirVersion, type, r),
    );
  }
  if (isType(fhirVersion, type, resource)) {
    return [resource];
  }
  return [];
}

export function findPackageLocation(startDir: string) {
  let dir = startDir,
    prevDir;

  do {
    try {
      const currentPath = path.join(dir, "package.json");
      const content = readFileSync(currentPath, { encoding: "utf8" });
      JSON.parse(content);
      return currentPath;
    } catch (e) {
      if (!(e instanceof Error) || !("code" in e)) throw e;
      if (e.code !== "ENOENT" && e.code !== "ENOTDIR") throw e;
    }
    prevDir = dir;
    dir = path.resolve(dir, "..");
  } while (dir !== prevDir);

  throw new Error("Could not find package.json");
}

/**
 * Interface used to search dependencies for .index.json files and load their contents.
 * @param options Artifact Load options
 * @returns A list of resources of type T
 */
export default function loadArtifacts<
  Version extends FHIR_VERSION,
  T extends ResourceType<Version>,
>({
  fhirVersion,
  resourceType,
  silence,
  loadDevelopmentPackages,
  onlyPackages,
  currentDirectory,
}: {
  // Only support R4 and R4B for now.
  fhirVersion: Version;
  resourceType: T;
  silence?: boolean;
  loadDevelopmentPackages?: boolean;
  onlyPackages?: string[];
  currentDirectory: string;
}): Resource<Version, T>[] {
  const packageLocation = findPackageLocation(currentDirectory);
  const requirer = createRequire(packageLocation);

  const packageJSON: PackageJSON = requirer("./package.json");

  let deps = { ...packageJSON.dependencies };
  if (loadDevelopmentPackages) {
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
