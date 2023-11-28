import { expect, test } from "@jest/globals";
import { Patient } from "@iguhealth/fhir-types/r4/types";
import {
  Loc,
  pointer,
  descend,
  ascend,
  get,
  pathMeta,
  fields,
  root,
  toJSONPointer,
  typedPointer,
} from "./index";

test("pointer", () => {
  const loc = pointer("Patient", "123");
  expect(loc).toBe("Patient|123");
});

test("ascend pointer", () => {
  const loc = descend(pointer("Patient", "123"), "name");
  expect(ascend(loc)).toEqual({ parent: "Patient|123", field: "name" });
  // @ts-ignore
  expect(ascend(ascend(loc)?.parent)).toEqual(undefined);

  const nestedLoc = descend(
    descend(descend(pointer("Patient", "123"), "name"), 0),
    "given"
  );
  expect(nestedLoc).toEqual("Patient|123/name/0/given");
  expect(ascend(nestedLoc)).toEqual({
    parent: "Patient|123/name/0",
    field: "given",
  });

  // @ts-ignore
  expect(ascend(ascend(nestedLoc)?.parent)).toEqual({
    parent: "Patient|123/name",
    field: 0,
  });
});

test("get function", () => {
  const nestedLoc = descend(
    descend(descend(pointer("Patient", "123"), "name"), 0),
    "given"
  );

  const patient: Patient = {
    resourceType: "Patient",
    id: "123",
    name: [{ given: ["John"] }],
  };

  expect(get(nestedLoc, patient)).toEqual(["John"]);
  expect(
    get(descend(descend(pointer("Patient", "123"), "name"), 1), patient)
  ).toEqual(undefined);

  expect(
    get(
      descend(descend(descend(pointer("Patient", "123"), "name"), 1), "given"),
      patient
    )
  ).toEqual(undefined);

  expect(
    get(
      descend(
        descend(descend(pointer("Patient", "123"), "identifier"), 1),
        "system"
      ),
      patient
    )
  ).toEqual(undefined);
});

test("path meta", () => {
  const nestedLoc = descend(pointer("Patient", "123"), "name");
  expect(pathMeta(nestedLoc)).toEqual({ resourceType: "Patient", id: "123" });
});

test("fields", () => {
  const nestedLoc = descend(
    descend(descend(pointer("Patient", "123"), "name"), 0),
    "given"
  );
  expect(fields(nestedLoc)).toEqual(["name", 0, "given"]);
});

test("root", () => {
  const nestedLoc = descend(
    descend(descend(pointer("Patient", "123"), "name"), 0),
    "given"
  );
  expect(root(nestedLoc)).toEqual("Patient|123");
});

test("escaping strings.", () => {
  const loc = pointer("Patient", "asdf") as Loc<any, any>;
  const escapedLoc = descend(descend(loc, "~name"), "/test");
  expect(escapedLoc).toEqual("Patient|asdf/~0name/~1test");
  expect(toJSONPointer(escapedLoc)).toEqual("/~0name/~1test");
  expect(get(escapedLoc, { "~name": { "/test": "test" } })).toEqual("test");
});

test("typedpointer", () => {
  const loc = typedPointer() as Loc<any, any>;
  const escapedLoc = descend(descend(loc, "~name"), "/test");
  expect(escapedLoc).toEqual("/~0name/~1test");
  expect(toJSONPointer(escapedLoc)).toEqual("/~0name/~1test");
  expect(get(escapedLoc, { "~name": { "/test": "test" } })).toEqual("test");
});
