import { selector } from "recoil";

import { isResponseError } from "@iguhealth/client/http";
import { Toaster } from "@iguhealth/components";
import { R4 } from "@iguhealth/fhir-types/versions";

import { getClient } from "./client";

export const getCapabilities = selector({
  key: "servercapabilities",
  get: async ({ get }) => {
    try {
      const client = get(getClient);
      const capabilityStatement = await client.capabilities({}, R4);
      return capabilityStatement;
    } catch (e) {
      if (isResponseError(e)) {
        Toaster.error(
          e.response.body.issue?.[0]?.diagnostics ??
            "Failed to fetch server capabilities.",
        );
      } else {
        Toaster.error("Failed to fetch server capabilities.");
      }
    }
  },
});
