import { expect, test } from "@jest/globals";

test("test oidc discovery global", async () => {
  const oidcDocument = await fetch(
    "http://localhost:3000/oidc/.well-known/openid-configuration",
  ).then((res) => res.json());

  expect(oidcDocument).toHaveProperty("issuer");
});

test("test oidc discovery tenant", async () => {
  const oidcDocument = await fetch(
    "http://localhost:3000/w/system/oidc/.well-known/openid-configuration",
  ).then((res) => res.json());

  expect(oidcDocument).toHaveProperty("issuer");
});
