import parseFHIRSearch from "./index";

test("Test resource level", () => {
  expect(parseFHIRSearch("Patient?name:text=bob")).toEqual({
    resourceType: "Patient",
    parameters: { name: { name: "name", modifier: "text", value: ["bob"] } },
  });
});

test("Test System level", () => {
  expect(
    parseFHIRSearch("Patient?name:text=bob&lastUpdated:not-in=1980-01-01")
  ).toEqual({
    resourceType: "Patient",
    parameters: {
      name: { name: "name", modifier: "text", value: ["bob"] },
      lastUpdated: {
        name: "lastUpdated",
        modifier: "not-in",
        value: ["1980-01-01"],
      },
    },
  });
});
