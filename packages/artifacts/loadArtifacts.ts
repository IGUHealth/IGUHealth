import { createRequire } from "node:module";
import {
  Resource,
  Bundle,
  ResourceType,
  AResource,
} from "@genfhi/fhir-types/r4/types";
import { IndexFile, PackageJSON } from "./types";

function isBundle(r: Resource): r is Bundle {
  return r?.resourceType === "Bundle";
}

function isType<T extends ResourceType>(
  type: T,
  r: Resource | undefined
): r is AResource<T> {
  return r !== undefined && r.resourceType === type;
}

function flattenOrInclude<T extends ResourceType>(
  type: T,
  resource: Resource
): AResource<T>[] {
  if (isBundle(resource)) {
    let resources = (resource.entry || [])?.map((entry) => entry.resource);
    return resources.filter((r: Resource | undefined): r is AResource<T> =>
      isType(type, r)
    );
  }
  if (isType(type, resource)) {
    return [resource];
  }
  return [];
}
/*
 ** Interface used to search dependencies for .index.config.json files and load their contents.
 */
export default function loadArtifacts<T extends ResourceType>(
  resourceType: T,
  location: string
): AResource<T>[] {
  const requirer = createRequire(location);
  const packageJson: PackageJSON = requirer("./package.json");
  const deps = { ...packageJson.devDependencies, ...packageJson.dependencies };
  return Object.keys(deps || {})
    .filter((d) => {
      try {
        const depPackage = requirer(`${d}/package.json`);
        return !!depPackage.fhirVersion;
      } catch (e) {
        return false;
      }
    })
    .map((d) => {
      try {
        console.log(` '${d}' Checking package for .index.config.json`);
        const indexFile: IndexFile | undefined = requirer(
          `${d}/.index.config.json`
        );
        if (indexFile?.files) {
          const fileInfos = resourceType
            ? indexFile.files.filter(
                (metaInfo) =>
                  metaInfo.resourceType &&
                  resourceType === metaInfo.resourceType
              )
            : indexFile.files;
          return fileInfos
            .map((r) =>
              flattenOrInclude(resourceType, requirer(`${d}/${r.filename}`))
            )
            .flat();
        }
        return [];
      } catch (e) {
        return [];
      }
    })
    .flat();
}
