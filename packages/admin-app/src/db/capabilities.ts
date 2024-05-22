import { selector } from "recoil";

import { Toaster } from "@iguhealth/components";
import { R4 } from "@iguhealth/fhir-types/versions";
import { isOperationError } from "@iguhealth/operation-outcomes";

import { getClient } from "./client";

export const getCapabilities = selector({
  key: "servercapabilities",
  get: async ({ get }) => {
    try {
      const client = get(getClient);
      const capabilityStatement = await client.capabilities({}, R4);
      return capabilityStatement;
    } catch (e) {
      if (isOperationError(e)) {
        Toaster.error(
          e.operationOutcome.issue?.[0]?.diagnostics ??
            "Failed to fetch server capabilities.",
        );
      } else {
        Toaster.error("Failed to fetch server capabilities.");
      }
    }
  },
});
