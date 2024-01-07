import { test, expect } from "@jest/globals";
import parseFHIRSearch, { escapeParameter, unescapeParameter } from "./url.js";

test("Test resource level", () => {
  expect(parseFHIRSearch("Patient?name:text=bob")).toEqual([
    { name: "name", modifier: "text", value: ["bob"] },
  ]);
});

test("Test System level", () => {
  expect(
    parseFHIRSearch("Patient?name:text=bob&lastUpdated:not-in=1980-01-01")
  ).toEqual([
    { name: "name", modifier: "text", value: ["bob"] },
    {
      name: "lastUpdated",
      modifier: "not-in",
      value: ["1980-01-01"],
    },
  ]);
});

test("TEST ESCAPING", () => {
  expect(escapeParameter("test|123")).toEqual("test\\|123");
  expect(unescapeParameter(escapeParameter("test|123"))).toEqual("test|123");
  expect(escapeParameter("test\\123")).toEqual("test\\\\123");
  expect(unescapeParameter(escapeParameter("test\\123"))).toEqual("test\\123");
  expect(escapeParameter("test$123")).toEqual("test\\$123");
  expect(escapeParameter("test,123")).toEqual("test\\,123");
});
