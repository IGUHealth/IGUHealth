import { ResourceType, id } from "@iguhealth/fhir-types/r4/types";
import parseParameters from "@iguhealth/client/url";
import { loadArtifacts } from "@iguhealth/artifacts";
import { expect, test } from "@jest/globals";
import path from "path";

import {
  SearchParameter,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import type { InternalData } from "./types.js";
import CreateMemoryDatabaseAsync from "./async.js";

const artifactParameters = loadArtifacts(
  "SearchParameter",
  path.join(__dirname, "../../"),
  true
);

let data: InternalData<ResourceType> = {};
for (const resource of artifactParameters) {
  data = {
    ...data,
    [resource.resourceType]: {
      ...data[resource.resourceType],
      [resource.id as id]: resource,
    },
  };
}

function generateParameter(
  fieldOverrides: Partial<SearchParameter>
): SearchParameter {
  return {
    resourceType: "SearchParameter",
    type: "token",
    description: "test parameter",
    base: ["Patient"],
    url: "https://searchParam",
    status: "active",
    name: "Test",
    code: "test",
    ...fieldOverrides,
  };
}

function generateSD(
  fieldOverrides: Partial<StructureDefinition>
): StructureDefinition {
  return {
    resourceType: "StructureDefinition",
    description: "test SD",
    url: "https://my-sd",
    abstract: false,
    type: "CustomType",
    kind: "resource",
    status: "active",
    name: "SD",
    ...fieldOverrides,
  };
}

test("Creation and search", async () => {
  const memDb = CreateMemoryDatabaseAsync(data);
  await memDb.create(
    {},
    generateParameter({
      id: "test1",
      name: "test1",
    })
  );
  await memDb.create(
    {},
    generateParameter({
      id: "test2",
      name: "test2",
    })
  );

  await memDb.create({}, generateSD({ id: "test0", name: "test1" }));
  expect(
    (
      await memDb.search_type(
        {},
        "SearchParameter",
        parseParameters("SearchParameter?name=test")
      )
    ).resources
  ).toEqual([]);

  expect(
    (
      await memDb.search_type(
        {},
        "SearchParameter",
        parseParameters("SearchParameter?name=test1")
      )
    ).resources
  ).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
    }),
  ]);
});

test("artifactParameters", async () => {
  const memDb = CreateMemoryDatabaseAsync(data);
  // Domainresource 1 param
  // Resource 11
  // Patient 23
  const parameters = (
    await memDb.search_type(
      {},
      "SearchParameter",
      parseParameters("SearchParameter?base=Patient,Resource,DomainResource")
    )
  ).resources;
  expect(parameters.length).toEqual(34);

  expect(
    (
      await memDb.search_type(
        {},
        "SearchParameter",
        parseParameters("SearchParameter?base=DomainResource")
      )
    ).resources.map((s) => (s as SearchParameter).name)
  ).toEqual(["_text"]);

  expect(
    (
      await memDb.search_type(
        {},
        "SearchParameter",
        parseParameters("SearchParameter?base=Resource")
      )
    ).resources.map((s) => (s as SearchParameter).name)
  ).toEqual([
    "_content",
    "_id",
    "_lastUpdated",
    "_profile",
    "_query",
    "_security",
    "_source",
    "_tag",
    "_iguhealth-version-seq",
    "_iguhealth-author",
  ]);

  expect(
    (
      await memDb.search_type(
        {},
        "SearchParameter",
        parseParameters("SearchParameter?base=Patient")
      )
    ).resources.map((s) => s.id)
  ).toMatchSnapshot();

  expect(
    (
      await memDb.search_type(
        {},
        "SearchParameter",
        parseParameters(
          "SearchParameter?base=Patient,Resource,DomainResource&type=string"
        )
      )
    ).resources.map((s) => s.id)
  ).toMatchSnapshot();

  expect(
    (
      await memDb.search_type(
        {},
        "SearchParameter",
        parseParameters(
          "SearchParameter?base=Patient,Resource,DomainResource&type=date"
        )
      )
    ).resources.map((s) => s.id)
  ).toMatchSnapshot();
});
