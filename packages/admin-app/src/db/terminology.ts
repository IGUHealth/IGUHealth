import { selectorFamily } from "recoil";

import { ValueSetExpand } from "@iguhealth/generated-ops/r4";

import { getClient } from "./client";
import { uri } from "@iguhealth/fhir-types/r4/types";

export const getValueSetExpansion = selectorFamily({
  key: "expansion",
  get:
    (url: string) =>
    async ({ get }) => {
      const client = get(getClient);
      const expansion = client.invoke_type(ValueSetExpand.Op, {}, "ValueSet", {
        url: url as uri,
      });
      return expansion;
    },
});
