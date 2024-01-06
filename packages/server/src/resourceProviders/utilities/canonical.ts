import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import type { toReference } from "./search/dataConversion.js";

export function createResolverRemoteCanonical<
  CTX,
  Client extends FHIRClientAsync<CTX>
>(client: Client, ctx: CTX): Parameters<typeof toReference>[2] {
  return async (types, url) => {
    const results = await client.search_system(ctx, [
      { name: "_type", value: types },
      { name: "url", value: [url] },
    ]);
    if (results.resources.length !== 1) {
      return undefined;
    }
    return results.resources[0];
  };
}
