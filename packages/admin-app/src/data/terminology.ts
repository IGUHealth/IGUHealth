import { selectorFamily } from "recoil";

import { ValueSetExpand } from "@iguhealth/generated-ops/r4";

import { getClient } from "./client";

export const getValueSetExpansion = selectorFamily({
  key: "expansion",
  get:
    (url: string) =>
    async ({ get }) => {
      const client = get(getClient);
      const expansion = client.invoke_type(ValueSetExpand.Op, {}, "ValueSet", {
        url,
      });
      return expansion;
    },
});
