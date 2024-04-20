import { selector } from "recoil";

import { getClient } from "./client";

export const getCapabilities = selector({
  key: "servercapabilities",
  get: async ({ get }) => {
    const client = get(getClient);
    const capabilityStatement = await client.capabilities({
      fhirVersion: "4.0",
    });
    return capabilityStatement;
  },
});
