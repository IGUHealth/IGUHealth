import { ascend, createPath, descend } from "./path";
import { expect, test } from "@jest/globals";

test("Path", () => {
  let path = createPath();
  expect(path).toEqual("");
  path = descend(path, "id");
  expect(path).toEqual("/id");
  expect(ascend(path)).toEqual({ parent: "", field: "id" });
});
