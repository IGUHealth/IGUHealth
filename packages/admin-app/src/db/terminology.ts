import { selectorFamily } from "recoil";

import { uri } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { ValueSetExpand } from "@iguhealth/generated-ops/r4";

import { getClient } from "./client";

export const getValueSetExpansion = selectorFamily({
  key: "expansion",
  get:
    (url: string) =>
    async ({ get }) => {
      const client = get(getClient);
      const expansion = client.invoke_type(
        ValueSetExpand.Op,
        {},
        R4,
        "ValueSet",
        {
          url: url as uri,
        },
      );
      return expansion;
    },
});
