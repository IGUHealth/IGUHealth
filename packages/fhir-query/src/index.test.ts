import parseFHIRSearch from "./index";

test("Test resource level", () => {
  expect(
    parseFHIRSearch(
      new URL(
        "https://fhir-api.com/Patient?name:text=bob",
        "https://fhir-api.com/"
      )
    )
  ).toEqual({
    resourceType: "Patient",
    parameters: { name: { name: "name", modifier: "text", value: "bob" } },
  });
});

test("Test System level", () => {
  expect(
    parseFHIRSearch(
      new URL(
        "https://fhir-api.com/?name:text=bob&lastUpdated:not-in=1980-01-01",
        "https://fhir-api.com/"
      )
    )
  ).toEqual({
    parameters: {
      name: { name: "name", modifier: "text", value: "bob" },
      lastUpdated: {
        name: "lastUpdated",
        modifier: "not-in",
        value: "1980-01-01",
      },
    },
  });
});
