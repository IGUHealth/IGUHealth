import path from "path";
import fs from "node:fs";

import { Bundle } from "@iguhealth/fhir-types/r4/types";

import { IndexFile } from "./types.js";

function getAllFiles(directory: string): string[] {
  const files: string[] = [];
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      files.push(...getAllFiles(absolute));
    } else {
      files.push(absolute);
    }
  }
  return files;
}

function checkBundleResourceTypesAlign(b: Bundle): boolean {
  const resourceTypes = (b.entry || []).map((e) => e.resource?.resourceType);
  const set = new Set(resourceTypes);
  return set.size === 1 && resourceTypes[0] !== undefined;
}

export default function generateIndexFile(
  root: string,
  artifactLocations: string[],
  ignore: string[] = []
) {
  // Read artifactLocation and recursively walk the directory tree reading all files from root
  // For each file, read the contents and parse the JSON
  // If the JSON has a "resourceType" property, add it to the index
  const index: IndexFile = { "index-version": "1", files: [] };
  const files = artifactLocations
    .map((loc) => path.join(root, loc))
    .map(getAllFiles)
    .flat()
    .filter((f) => f.endsWith(".json"))
    .filter((f) => ignore.indexOf(f) === -1);
  for (let file of files) {
    const fileContents = fs.readFileSync(file);
    const json = JSON.parse(fileContents.toString("utf8"));
    if (json.resourceType === "Bundle") {
      const bundle = json as Bundle;
      // Add to index
      const resourceTypes = new Set(
        bundle.entry?.map((entry) => entry.resource?.resourceType)
      );

      index.files = (index.files || []).concat(
        [...resourceTypes].map((resourceType) => ({
          filename: file,
          resourceType,
        }))
      );
    } else if (json.resourceType) {
      // Add to index
      index.files = (index.files || []).concat([
        {
          filename: file,
          resourceType: json.resourceType,
        },
      ]);
    }
  }
  return index;
}
