import { FHIRServerCTX } from "../../fhir-context/types.js";
import type { ResolveRemoteCanonical } from "./search/dataConversion.js";

export function createResolverRemoteCanonical(
  ctx: FHIRServerCTX,
): ResolveRemoteCanonical {
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
