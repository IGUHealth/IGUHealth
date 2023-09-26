import { createRequire } from "node:module";
import {
  Resource,
  Bundle,
  ResourceType,
  AResource,
} from "@iguhealth/fhir-types/r4/types";
import { IndexFile, PackageJSON } from "./types.js";
import { deepStrictEqual } from "node:assert";

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
  location: string,
  silence = false
): AResource<T>[] {
  const requirer = createRequire(location);
  const packageJSON: PackageJSON = requirer("./package.json");
  let deps = { ...packageJSON.dependencies };
  // https://jestjs.io/docs/environment-variables
  // JEST sets environment to test by default.
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    deps = { ...deps, ...packageJSON.devDependencies };
  }

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
        if (!silence)
          console.log(
            ` '${d}' Loading package contents from .index.config.json for resourceType '${resourceType}'`
          );
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
            .map((r) => {
              return flattenOrInclude(
                resourceType,
                requirer(`${d}/${r.filename}`)
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
