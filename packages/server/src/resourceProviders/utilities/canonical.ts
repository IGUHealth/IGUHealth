import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import type { toReference } from "./search/dataConversion.js";
import { FHIRServerCTX } from "../../fhir/context.js";

export function createResolverRemoteCanonical(
  ctx: FHIRServerCTX
): Parameters<typeof toReference>[2] {
  return async (types, url) => {
    const results = await ctx.client.search_system(ctx, [
      { name: "_type", value: types },
      { name: "url", value: [url] },
    ]);
    if (results.resources.length !== 1) {
      return undefined;
    }
    return results.resources[0];
  };
}
