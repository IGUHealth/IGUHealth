import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { canonical } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import type { ResolveCanonical } from "./search/dataConversion.js";

export function createResolverRemoteCanonical<CTX>(
  client: FHIRClientAsync<CTX>,
  ctx: CTX,
): ResolveCanonical {
  return async <FHIRVersion extends FHIR_VERSION>(
    fhirVersion: FHIRVersion,
    types: ResourceType<FHIRVersion>[],
    url: canonical,
  ) => {
    const results = await client.search_system(ctx, fhirVersion, [
      { name: "_type", value: types },
      { name: "url", value: [url] },
    ]);

    if (results.resources.length !== 1) {
      return undefined;
    }

    return results.resources[0] as
      | Resource<FHIRVersion, ResourceType<FHIRVersion>>
      | undefined;
  };
}
