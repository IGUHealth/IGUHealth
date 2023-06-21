import MemoryDatabase from "./memory";
import parseURL from "@genfhi/fhir-query";
import { SearchParameter } from "@genfhi/fhir-types/r4/types";

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

  expect(
    memDb.search(
      parseURL("https://test.com", "https://test.com/SearchParameter?name=test")
    )
  ).toEqual([]);

  expect(
    memDb.search(
      parseURL(
        "https://test.com",
        "https://test.com/SearchParameter?name=test1"
      )
    )
  ).toEqual([
    generateParameter({
      name: "test1",
    }),
  ]);

  expect(
    memDb.search(
      parseURL("https://test.com", "https://test.com/SearchParameter")
    )
  ).toEqual([
    generateParameter({
      name: "test1",
    }),
    generateParameter({
      name: "test2",
    }),
  ]);
});
