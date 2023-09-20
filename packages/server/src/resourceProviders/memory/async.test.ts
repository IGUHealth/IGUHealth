import parseParameters from "@iguhealth/client/url";
import { loadArtifacts } from "@iguhealth/artifacts";
import { expect, test } from "@jest/globals";
import path from "path";

import {
  SearchParameter,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import CreateMemoryDatabaseAsync from "./async.js";

const artifactParameters = loadArtifacts(
  "SearchParameter",
  path.join(__dirname, "../../"),
  true
);

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
  const memDb = CreateMemoryDatabaseAsync({});
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

  expect(
    (await memDb.search_type({}, "SearchParameter", [])).resources
  ).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
    }),
    generateParameter({
      id: "test2",
      name: "test2",
    }),
  ]);

  expect(
    (await memDb.search_system({}, parseParameters("?name=test1"))).resources
  ).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
    }),
    generateSD({
      id: "test0",
      name: "test1",
    }),
  ]);
});

test("artifactParameters", async () => {
  const memDb = CreateMemoryDatabaseAsync({});
  for (let param of artifactParameters) {
    //console.log(param.base[0], param.id);
    await memDb.create({}, param);
  }
  // Domainresource 1 param
  // Resource 11
  // Patient 23
  expect(
    (
      await memDb.search_type(
        {},
        "SearchParameter",
        parseParameters("SearchParameter?base=Patient,Resource,DomainResource")
      )
    ).resources.length
  ).toEqual(34);
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
