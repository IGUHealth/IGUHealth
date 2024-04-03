import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import parseParameters from "@iguhealth/client/lib/url";
import {
  ResourceType,
  SearchParameter,
  StructureDefinition,
  id,
} from "@iguhealth/fhir-types/lib/r4/types";

import { testServices } from "../../test-ctx.js";
import CreateMemoryDatabaseAsync from "./async.js";
import type { InternalData } from "./types.js";

const artifactParameters = loadArtifacts({
  resourceType: "SearchParameter",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../../../"),
  silence: true,
});
const sds = loadArtifacts({
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../../../"),
  silence: true,
});

let data: InternalData<ResourceType> = {};
for (const resource of [...artifactParameters, ...sds]) {
  data = {
    ...data,
    [resource.resourceType]: {
      ...data[resource.resourceType],
      [resource.id as id]: resource,
    },
  };
}

function generateParameter(
  fieldOverrides: Partial<SearchParameter>,
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
  } as SearchParameter;
}

function generateSD(
  fieldOverrides: Partial<StructureDefinition>,
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
  } as StructureDefinition;
}

test("Creation and search", async () => {
  const memDb = CreateMemoryDatabaseAsync(data);
  await memDb.create(
    testServices,
    generateParameter({
      id: "test1",
      name: "test1",
      code: "test1",
    } as SearchParameter),
  );
  await memDb.create(
    testServices,
    generateParameter({
      id: "test2",
      name: "test2",
      code: "test2",
    } as SearchParameter),
  );

  await memDb.create(
    testServices,
    generateSD({ id: "test0", name: "test1" } as StructureDefinition),
  );

  expect(
    (
      await memDb.search_type(
        testServices,
        "SearchParameter",
        parseParameters("SearchParameter?code=test"),
      )
    ).resources,
  ).toEqual([]);

  expect(
    (
      await memDb.search_type(
        testServices,
        "SearchParameter",
        parseParameters("SearchParameter?code=test1"),
      )
    ).resources,
  ).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
      code: "test1",
    } as SearchParameter),
  ]);
});

test("artifactParameters", async () => {
  const memDb = CreateMemoryDatabaseAsync(data);
  // Domainresource 1 param
  // Resource 11
  // Patient 23
  const parameters = (
    await memDb.search_type(
      testServices,
      "SearchParameter",
      parseParameters("SearchParameter?base=Patient,Resource,DomainResource"),
    )
  ).resources;
  expect(parameters.length).toEqual(34);

  expect(
    (
      await memDb.search_type(
        testServices,
        "SearchParameter",
        parseParameters("SearchParameter?base=DomainResource"),
      )
    ).resources.map((s) => (s as SearchParameter).name),
  ).toEqual(["_text"]);

  expect(
    (
      await memDb.search_type(
        testServices,
        "SearchParameter",
        parseParameters("SearchParameter?base=Resource"),
      )
    ).resources.map((s) => (s as SearchParameter).name),
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
        testServices,
        "SearchParameter",
        parseParameters("SearchParameter?base=Patient"),
      )
    ).resources.map((s) => s.id),
  ).toMatchSnapshot();

  expect(
    (
      await memDb.search_type(
        testServices,
        "SearchParameter",
        parseParameters(
          "SearchParameter?base=Patient,Resource,DomainResource&type=string",
        ),
      )
    ).resources.map((s) => s.id),
  ).toMatchSnapshot();

  expect(
    (
      await memDb.search_type(
        testServices,
        "SearchParameter",
        parseParameters(
          "SearchParameter?base=Patient,Resource,DomainResource&type=date",
        ),
      )
    ).resources.map((s) => s.id),
  ).toMatchSnapshot();
});
