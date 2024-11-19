import { expect, test } from "@jest/globals";

import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";

import { descend, pointer, toFHIRPath } from "./index.js";

test("Test fhirpath conversion", async () => {
  expect(
    toFHIRPath(
      descend(
        descend(
          descend(
            pointer(R4, "Observation", "test" as id),
            "valueCodeableConcept",
          ),
          "coding",
        ),
        0,
      ),
    ),
  ).toEqual("$this.value.coding[0]");
});
