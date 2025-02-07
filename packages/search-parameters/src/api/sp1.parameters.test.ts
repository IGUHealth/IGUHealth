import { expect, test } from "@jest/globals";

import { R4, R4B } from "@iguhealth/fhir-types/versions";

import { loadParameters } from "./load.js";
import { generateSP1Sets } from "./sp1.parameters.js";

test("Test R4 sp1 Parameters", async () => {
  const r4 = loadParameters(R4);
  const r4b = loadParameters(R4B);

  await generateSP1Sets(R4, r4);
  expect(generateSP1Sets(R4, r4)).resolves.toMatchSnapshot();
  expect(generateSP1Sets(R4B, r4b)).resolves.toMatchSnapshot();
});
