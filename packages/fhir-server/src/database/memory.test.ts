import parseURL from "@genfhi/fhir-query";
import loadArtifacts from "@genfhi/artifacts/loadArtifacts";
import path from "path";

import MemoryDatabase from "./memory";
import {
  SearchParameter,
  StructureDefinition,
} from "@genfhi/fhir-types/r4/types";

const artifactParameters = loadArtifacts(
  "SearchParameter",
  path.join(__dirname, "../")
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
  const memDb = new MemoryDatabase<{}>();
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
    await memDb.search_type(
      {},
      "SearchParameter",
      parseURL("SearchParameter?name=test").parameters
    )
  ).toEqual([]);

  expect(
    await memDb.search_type(
      {},
      "SearchParameter",
      parseURL("SearchParameter?name=test1").parameters
    )
  ).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
    }),
  ]);

  expect(await memDb.search_type({}, "SearchParameter", {})).toEqual([
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
    await memDb.search_system({}, parseURL("?name=test1").parameters)
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

test("artifactParameters", () => {
  const memDb = new MemoryDatabase<{}>();
  for (let param of artifactParameters) {
    //console.log(param.base[0], param.id);
    memDb.create({}, param);
  }
  // Domainresource 1 param
  // Resource 11
  // Patient 23
  expect(
    memDb.search_type(
      {},
      "SearchParameter",
      parseURL("SearchParameter?base=Patient,Resource,DomainResource")
        .parameters
    ).length
  ).toEqual(32);
  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseURL("SearchParameter?base=DomainResource").parameters
      )
      .map((s) => (s as SearchParameter).name)
  ).toEqual(["_text"]);

  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseURL("SearchParameter?base=Resource").parameters
      )
      .map((s) => (s as SearchParameter).name)
  ).toEqual([
    "_content",
    "_id",
    "_lastUpdated",
    "_profile",
    "_query",
    "_security",
    "_source",
    "_tag",
  ]);

  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseURL("SearchParameter?base=Patient").parameters
      )
      .map((s) => s.id)
  ).toMatchSnapshot();

  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseURL(
          "SearchParameter?base=Patient,Resource,DomainResource&type=string"
        ).parameters
      )
      .map((s) => s.id)
  ).toMatchSnapshot();

  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseURL(
          "SearchParameter?base=Patient,Resource,DomainResource&type=date"
        ).parameters
      )
      .map((s) => s.id)
  ).toMatchSnapshot();
});
