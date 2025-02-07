import { expect, test } from "@jest/globals";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import parseParameters from "@iguhealth/client/lib/url";
import {
  ResourceType,
  SearchParameter,
  StructureDefinition,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4, R4B } from "@iguhealth/fhir-types/lib/versions";
import { loadParameters } from "@iguhealth/search-parameters/api/load";

import { testServices } from "../../test-ctx.js";
import { Memory } from "./async.js";
import type { InternalData } from "./types.js";

const artifactParameters = loadParameters(R4);
const sds = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  currentDirectory: fileURLToPath(import.meta.url),
  silence: true,
});

let r4data: InternalData<R4, ResourceType> = {};
for (const resource of [...artifactParameters, ...sds]) {
  r4data = {
    ...r4data,
    [resource.resourceType]: {
      ...r4data[resource.resourceType],
      [resource.id as id]: resource,
    },
  };
}

let data = { [R4]: r4data, [R4B]: {} };

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
  const memDb = new Memory(data);
  await memDb.create(
    testServices,
    R4,
    generateParameter({
      id: "test1",
      name: "test1",
      code: "test1",
    } as SearchParameter),
  );
  await memDb.create(
    testServices,
    R4,
    generateParameter({
      id: "test2",
      name: "test2",
      code: "test2",
    } as SearchParameter),
  );

  await memDb.create(
    testServices,
    R4,
    generateSD({ id: "test0", name: "test1" } as StructureDefinition),
  );

  expect(
    await memDb.read(testServices, R4, "SearchParameter", "test1" as id),
  ).toEqual(
    generateParameter({
      id: "test1",
      name: "test1",
      code: "test1",
    } as SearchParameter),
  );

  expect(
    (
      await memDb.search_type(
        testServices,
        R4,
        "SearchParameter",
        parseParameters("SearchParameter?code=test"),
      )
    ).resources,
  ).toEqual([]);

  expect(
    (
      await memDb.search_type(
        testServices,
        R4,
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
  const memDb = new Memory(data);
  // Domainresource 1 param
  // Resource 11
  // Patient 23
  const parameters = (
    await memDb.search_type(
      testServices,
      R4,
      "SearchParameter",
      parseParameters("SearchParameter?base=Patient,Resource,DomainResource"),
    )
  ).resources;

  expect(parameters.length).toEqual(33);

  expect(
    (
      await memDb.search_type(
        testServices,
        R4,
        "SearchParameter",
        parseParameters("SearchParameter?base=DomainResource"),
      )
    ).resources.map((s) => (s as SearchParameter).name),
  ).toEqual(["_text"]);

  expect(
    (
      await memDb.search_type(
        testServices,
        R4,
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
    "_iguhealth-author",
  ]);

  expect(
    (
      await memDb.search_type(
        testServices,
        R4,
        "SearchParameter",
        parseParameters("SearchParameter?base=Patient"),
      )
    ).resources.map((s) => s.id),
  ).toMatchSnapshot();

  expect(
    (
      await memDb.search_type(
        testServices,
        R4,
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
        R4,
        "SearchParameter",
        parseParameters(
          "SearchParameter?base=Patient,Resource,DomainResource&type=date",
        ),
      )
    ).resources.map((s) => s.id),
  ).toMatchSnapshot();
});
