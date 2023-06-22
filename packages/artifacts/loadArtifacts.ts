import { readFileSync } from "fs";
import { createRequire } from "node:module";
import process from "process";
import { Resource, Bundle } from "@genfhi/fhir-types/r4/types";

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

function isResource(r: Resource | undefined): r is Resource {
  return r !== undefined;
}

function flattenOrInclude(r: Resource): Resource[] {
  if (isBundle(r)) {
    return (r.entry || [])?.map((entry) => entry.resource).filter(isResource);
  }
  return [r];
}
/*
 ** Interface used to search dependencies for .index.config.json files and load their contents.
 */
export default function loadArtifacts(resourceTypes?: string[]): Resource[] {
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
          const fileInfos = resourceTypes
            ? indexFile.files.filter(
                (metaInfo) =>
                  metaInfo.resourceType &&
                  resourceTypes.indexOf(metaInfo.resourceType) !== -1
              )
            : indexFile.files;
          return fileInfos
            .map((r) => flattenOrInclude(requirer(`${d}/${r.filename}`)))
            .flat();
        }
        return [];
      } catch (e) {
        return [];
      }
    })
    .flat();
}
