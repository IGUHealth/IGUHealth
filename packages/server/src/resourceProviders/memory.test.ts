import parseParameters from "@iguhealth/client/lib/url.js";
import { loadArtifacts } from "@iguhealth/artifacts";
import { expect, test } from "@jest/globals";
import path from "path";

import {
  SearchParameter,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import createMemoryDatabase from "./memory";

const artifactParameters = loadArtifacts(
  "SearchParameter",
  path.join(__dirname, "../"),
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
  const memDb = createMemoryDatabase({});
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
      parseParameters("SearchParameter?name=test")
    )
  ).toEqual([]);

  expect(
    await memDb.search_type(
      {},
      "SearchParameter",
      parseParameters("SearchParameter?name=test1")
    )
  ).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
    }),
  ]);

  expect(await memDb.search_type({}, "SearchParameter", [])).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
    }),
    generateParameter({
      id: "test2",
      name: "test2",
    }),
  ]);

  expect(await memDb.search_system({}, parseParameters("?name=test1"))).toEqual(
    [
      generateParameter({
        id: "test1",
        name: "test1",
      }),
      generateSD({
        id: "test0",
        name: "test1",
      }),
    ]
  );
});

test("artifactParameters", () => {
  const memDb = createMemoryDatabase({});
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
      parseParameters("SearchParameter?base=Patient,Resource,DomainResource")
    ).length
  ).toEqual(32);
  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseParameters("SearchParameter?base=DomainResource")
      )
      .map((s) => (s as SearchParameter).name)
  ).toEqual(["_text"]);

  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseParameters("SearchParameter?base=Resource")
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
        parseParameters("SearchParameter?base=Patient")
      )
      .map((s) => s.id)
  ).toMatchSnapshot();

  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseParameters(
          "SearchParameter?base=Patient,Resource,DomainResource&type=string"
        )
      )
      .map((s) => s.id)
  ).toMatchSnapshot();

  expect(
    memDb
      .search_type(
        {},
        "SearchParameter",
        parseParameters(
          "SearchParameter?base=Patient,Resource,DomainResource&type=date"
        )
      )
      .map((s) => s.id)
  ).toMatchSnapshot();
});
