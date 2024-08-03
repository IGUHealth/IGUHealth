import { expect, test } from "@jest/globals";

import { parseScopes, toString } from "./parse";

test("parsing openids", () => {
  expect(toString(parseScopes("openid"))).toEqual("openid");
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
      permissions: {
        create: false,
        read: true,
        update: true,
        delete: false,
        search: false,
      },
    },
    {
      scope: "resource",
      type: "smart-resource",
      level: "user",
      resourceType: "Encounter",
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
        search: true,
      },
    },
  ]);
  expect(
    toString(
      parseScopes(
        "openid fhirUser launch launch/encounter launch/patient user/Patient.ru user/Encounter.cruds",
      ),
    ),
  ).toEqual(
    "openid fhirUser launch launch/encounter launch/patient user/Patient.ru user/Encounter.cruds",
  );
});

test("*.* SMART", () => {
  expect(parseScopes("openid fhirUser user/*.*")).toEqual([
    {
      type: "openid",
    },
    {
      type: "fhirUser",
    },
    {
      level: "user",
      scope: "all",
      type: "smart-resource",
      permissions: {
        update: true,
        create: true,
        delete: true,
        search: true,
        read: true,
      },
    },
  ]);
  expect(toString(parseScopes("openid fhirUser user/*.*"))).toEqual(
    "openid fhirUser user/*.cruds",
  );
  expect(parseScopes("launch launch/patient patient/*.*")).toEqual([
    { type: "launch", scope: "" },
    { type: "launch", scope: "patient" },
    {
      level: "patient",
      scope: "all",
      type: "smart-resource",
      permissions: {
        update: true,
        create: true,
        delete: true,
        search: true,
        read: true,
      },
    },
  ]);
  expect(
    toString(parseScopes("openid fhirUser launch launch/patient patient/*.*")),
  ).toEqual("openid fhirUser launch launch/patient patient/*.cruds");
});
