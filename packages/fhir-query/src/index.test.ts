import { parseFHIRSearch } from "./index";

test("Test resource level", () => {
  expect(
    parseFHIRSearch(
      "https://fhir-api.com/",
      "https://fhir-api.com/Patient?name:text=bob"
    )
  ).toEqual({
    resourceType: "Patient",
    level: "resource",
    parameters: [{ name: "name", modifier: "text", value: "bob" }],
  });
});

test("Test System level", () => {
  expect(
    parseFHIRSearch(
      "https://fhir-api.com/",
      "https://fhir-api.com/?name:text=bob&lastUpdated:not-in=1980-01-01"
    )
  ).toEqual({
    level: "system",
    parameters: [
      { name: "name", modifier: "text", value: "bob" },
      { name: "lastUpdated", modifier: "not-in", value: "1980-01-01" },
    ],
  });
});
