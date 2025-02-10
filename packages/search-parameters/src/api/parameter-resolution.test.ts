import { expect, test } from "@jest/globals";

import { code } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4, R4B } from "@iguhealth/fhir-types/versions";

import resolveCanonical from "./parameter-resolution.js";

test("Resolution of parameters", async () => {
  // R4
  expect(resolveCanonical(R4, ["Patient"], "active" as code)).toEqual(
    "http://hl7.org/fhir/SearchParameter/Patient-active",
  );
  expect(resolveCanonical(R4, ["Patient"], "bad-param" as code)).toEqual(
    undefined,
  );
  expect(() =>
    resolveCanonical(R4, ["Patient", "Practitioner"], "name" as code),
  ).toThrow();
  expect(resolveCanonical(R4, ["Resource"], "_filter" as code)).toEqual(
    undefined,
  );

  // R4Bs
  expect(resolveCanonical(R4B, ["Patient"], "active" as code)).toEqual(
    "http://hl7.org/fhir/SearchParameter/Patient-active",
  );
  expect(resolveCanonical(R4B, ["SubscriptionTopic"], "date" as code)).toEqual(
    "http://hl7.org/fhir/SearchParameter/SubscriptionTopic-date",
  );
  expect(resolveCanonical(R4B, ["Resource"], "_filter" as code)).toEqual(
    "http://hl7.org/fhir/SearchParameter/Resource-filter",
  );
});
