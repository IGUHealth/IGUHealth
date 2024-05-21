import { selector } from "recoil";

import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthUsageStatistics } from "@iguhealth/generated-ops/r4";

import { getClient } from "./client";

export const getUsageStatistics = selector({
  key: "usageStatistics",
  get: async ({ get }) => {
    const client = get(getClient);
    const usageStatistics = await client.invoke_system(
      IguhealthUsageStatistics.Op,
      {},
      R4,
      {},
    );
    return usageStatistics;
  },
});
