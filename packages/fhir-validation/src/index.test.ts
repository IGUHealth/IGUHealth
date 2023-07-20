import path from "path";

import {
  StructureDefinition,
  Resource,
  ResourceType,
  code,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { expect, test } from "@jest/globals";
import { loadArtifacts } from "@iguhealth/artifacts";
import MemoryDatabase from "@iguhealth/fhir-server/lib/resourceProviders/memory";

import createValidator from "./index";

function createMemoryDatabase(resourceTypes: ResourceType[]) {
  const database = MemoryDatabase<any>({});
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(resourceType, path.join(__dirname, "./"), true)
    )
    .flat();
  for (const resource of artifactResources) {
    database.create({}, resource);
  }
  return database;
}

const memDatabase = createMemoryDatabase([
  ...resourceTypes.values(),
] as ResourceType[]);

test("Testing validating resourceType 'Patient'", async () => {
  const sd = memDatabase.read({}, "StructureDefinition", "Patient");

  const validator = createValidator((type: string) => {
    const sd = memDatabase.read({}, "StructureDefinition", type);
    if (!sd) throw new Error(`Couldn't find sd for type '${type}'`);
    return sd;
  }, "Patient");

  //   const patients = memDatabase.search_type({}, "Patient", {
  //     resourceType: "Patient",
  //     parameters: {},
  //   });
  try {
    await validator({
      resourceType: "Patient",
      id: "5",
      identifier: [
        {
          system: 5,
        },
      ],
    });
  } catch (e) {
    console.log("ERROR:");
    console.error(JSON.stringify(e, null, 2));
  }
});

// test.each([...resourceTypes.values()].sort((r, r2) => (r > r2 ? 1 : -1)))(
//   `Testing validating resourceType '%s'`,
//   (resourceType) => {
//     const structureDefinition = memDatabase.search_type(
//       {},
//       "StructureDefinition",
//       {
//         resourceType: "StructureDefinition",
//         parameters: {
//           base: {
//             name: "type",
//             value: [resourceType],
//           },
//         },
//       }
//     );
//     const sd = structureDefinition[0];

//     const resources = memDatabase
//       .search_type({}, resourceType as ResourceType, { parameters: {} })
//       .filter((r) => r.id)
//       .sort((r, r2) => JSON.stringify(r).localeCompare(JSON.stringify(r2)))
//       .slice(0, 10);
//     const validator = createValidator((type: string) => {
//       const sd = memDatabase.read({}, "StructureDefinition", type);
//       if (!sd) throw new Error(`Couldn't find sd for type '${type}'`);
//       return sd;
//     }, resourceType);

//     for (const resource of resources) {
//       validator(resource);
//     }
//   }
// );
