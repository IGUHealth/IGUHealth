import { expect, test } from "@jest/globals";

test("test oidc discovery tenant", async () => {
  const oidcDocument = await fetch(
    "http://localhost:3000/w/system/api/v1/fhir/r4/.well-known/smart-configuration",
  ).then((res) => res.json());

  expect(oidcDocument).toHaveProperty("issuer");
});
