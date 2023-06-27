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

test("Creation and search", async () => {
  const memDb = new MemoryDatabase();
  await memDb.create(
    generateParameter({
      id: "test1",
      name: "test1",
    })
  );
  await memDb.create(
    generateParameter({
      id: "test2",
      name: "test2",
    })
  );

  await memDb.create(generateSD({ id: "test0", name: "test1" }));

  expect(await memDb.search(parseURL("SearchParameter?name=test"))).toEqual([]);

  expect(await memDb.search(parseURL("SearchParameter?name=test1"))).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
    }),
  ]);

  expect(await memDb.search(parseURL("SearchParameter"))).toEqual([
    generateParameter({
      id: "test1",
      name: "test1",
    }),
    generateParameter({
      id: "test2",
      name: "test2",
    }),
  ]);

  expect(await memDb.search(parseURL("?name=test1"))).toEqual([
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
