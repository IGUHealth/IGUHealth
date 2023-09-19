import path from "path";
import { test, expect } from "@jest/globals";

import { ResourceType, Resource } from "@iguhealth/fhir-types/r4/types";
import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIRClientSync } from "@iguhealth/client/interface";

import MemoryDatabase from "../resourceProviders/memory.js";
import { TerminologyProviderMemory } from "./index.js";

// function createMemoryDatabase(
//   resourceTypes: ResourceType[]
// ): FHIRClientSync<any> {
//   const database = MemoryDatabase<any>({});
//   const artifactResources: Resource[] = resourceTypes
//     .map((resourceType) =>
//       loadArtifacts(resourceType, path.join(__dirname, "../"), true)
//     )
//     .flat();
//   for (const resource of artifactResources) {
//     database.create({}, resource);
//   }
//   return database;
// }

// const memDB = createMemoryDatabase(["ValueSet", "CodeSystem"]);
// const termProvider = new TerminologyProviderMemory();

// test("Quick expansion test", () => {
//   termProvider.expand(
//     {
//       workspace: "default",
//       author: "user",
//     },
//     {
//       url: "http://hl7.org/fhir/ValueSet/observation-category",
//     }
//   );
// });
