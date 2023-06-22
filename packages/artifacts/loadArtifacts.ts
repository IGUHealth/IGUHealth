import { readFileSync } from "fs";
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
  const packageJson: PackageJSON = require("package.json");
  return Object.values(packageJson.dependencies || {})
    .map((d) => {
      try {
        console.log(d);
        const indexFile:
          | IndexFile
          | undefined = require(`${d}/.index.config.json`);
        if (indexFile?.files) {
          const fileInfos = resourceTypes
            ? indexFile.files.filter(
                (metaInfo) =>
                  metaInfo.resourceType &&
                  resourceTypes.indexOf(metaInfo.resourceType) !== -1
              )
            : indexFile.files;
          return fileInfos
            .map((r) => flattenOrInclude(require(`${d}./${r.filename}`)))
            .flat();
        }
        return [];
      } catch (e) {
        return [];
      }
    })
    .flat();
}
