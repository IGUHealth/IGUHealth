import MemoryDatabase from "./memory";
import parseURL from "@genfhi/fhir-query";
import {
  SearchParameter,
  StructureDefinition,
} from "@genfhi/fhir-types/r4/types";

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

const prefixURL = `https://test.com/`;
function generateURL(path: string): URL {
  return new URL(`${prefixURL}${path}`, prefixURL);
}

test("Creation and search", () => {
  const memDb = new MemoryDatabase();
  memDb.create(
    generateParameter({
      name: "test1",
    })
  );
  memDb.create(
    generateParameter({
      name: "test2",
    })
  );

  memDb.create(generateSD({ name: "test1" }));

  expect(
    memDb.search(parseURL(generateURL("SearchParameter?name=test")))
  ).toEqual([]);

  expect(
    memDb.search(parseURL(generateURL("SearchParameter?name=test1")))
  ).toEqual([
    generateParameter({
      name: "test1",
    }),
  ]);

  expect(memDb.search(parseURL(generateURL("SearchParameter")))).toEqual([
    generateParameter({
      name: "test1",
    }),
    generateParameter({
      name: "test2",
    }),
  ]);

  expect(memDb.search(parseURL(generateURL("?name=test1")))).toEqual([
    generateParameter({
      name: "test1",
    }),
    generateSD({
      name: "test1",
    }),
  ]);
});
