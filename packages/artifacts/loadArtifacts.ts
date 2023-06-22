import { readFileSync } from "fs";
import { createRequire } from "node:module";
import process from "process";
import {
  Resource,
  Bundle,
  ResourceType,
  AResource,
} from "@genfhi/fhir-types/r4/types";

interface PackageJSON {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

type IndexedFiles = {
  filename?: string;
  resourceType?: string;
  id?: string;
  url?: string;
  version?: string;
  kind?: string;
  type?: string;
  supplements?: string;
  content?: string;
};

type IndexFile = {
  "index-version"?: string;
  files?: Array<IndexedFiles>;
};

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
  r: Resource
): AResource<T>[] {
  if (isBundle(r)) {
    let resources = (r.entry || [])?.map((entry) => entry.resource);
    return resources.filter((r) => isType(type, r));
  }
  if (isType(type, r)) {
    return [r];
  }
  return [];
}
/*
 ** Interface used to search dependencies for .index.config.json files and load their contents.
 */
export default function loadArtifacts<T extends ResourceType>(
  resourceType: T
): AResource<T>[] {
  const requirer = createRequire(process.cwd() + "/");
  const packageJson: PackageJSON = requirer("./package.json");
  return Object.keys(packageJson.dependencies || {})
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
