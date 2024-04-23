import { selector } from "recoil";

import { R4 } from "@iguhealth/fhir-types/versions";

import { getClient } from "./client";

export const getCapabilities = selector({
  key: "servercapabilities",
  get: async ({ get }) => {
    const client = get(getClient);
    const capabilityStatement = await client.capabilities({}, R4);
    return capabilityStatement;
  },
});
