import { expect, test } from "@jest/globals";

import { parseScopes } from "./parse";

test("parsing openids", () => {
  expect(parseScopes("openid")).toEqual([
    {
      type: "openid",
    },
  ]);
  expect(parseScopes("openid   profile email")).toEqual([
    {
      type: "openid",
    },
    { type: "profile" },
    { type: "email" },
  ]);
});

test("Invalid scopes", () => {
  expect(() => parseScopes("openid profile email fhirser")).toThrow();
});

test("Simple Smarts", () => {
  expect(
    parseScopes("openid fhirUser launch launch/encounter launch/patient"),
  ).toEqual([
    {
      type: "openid",
    },
    { type: "fhirUser" },
    { type: "launch", scope: "" },
    { type: "launch", scope: "encounter" },
    { type: "launch", scope: "patient" },
  ]);
});

test("Simple Smarts", () => {
  expect(
    parseScopes(
      "openid fhirUser launch launch/encounter launch/patient user/Patient.ru user/Encounter.cruds",
    ),
  ).toEqual([
    {
      type: "openid",
    },
    { type: "fhirUser" },
    { type: "launch", scope: "" },
    { type: "launch", scope: "encounter" },
    { type: "launch", scope: "patient" },
    {
      scope: "resource",
      type: "smart-resource",
      level: "user",
      resourceType: "Patient",
      create: false,
      read: true,
      update: true,
      delete: false,
      search: false,
    },
    {
      scope: "resource",
      type: "smart-resource",
      level: "user",
      resourceType: "Encounter",
      create: true,
      read: true,
      update: true,
      delete: true,
      search: true,
    },
  ]);
});

test("*.* SMART", () => {});
