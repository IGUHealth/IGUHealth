import { FHIRClientAsync } from "@iguhealth/client/lib/interface";

import type { ResolveCanonical } from "./dataConversion.js";

export function createResolverRemoteCanonical<CTX>(
  client: FHIRClientAsync<CTX>,
  ctx: CTX,
): ResolveCanonical {
  return async (fhirVersion, types, url) => {
    const results = await client.search_system(ctx, fhirVersion, [
      { name: "_type", value: types },
      { name: "url", value: [url] },
    ]);

    if (results.resources.length !== 1) {
      return undefined;
    }

    return results.resources[0];
  };
}
