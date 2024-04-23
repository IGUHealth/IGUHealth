import { canonical } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  VersionedAResource,
  VersionedResourceType,
} from "@iguhealth/fhir-types/versions";

import { FHIRServerCTX } from "../../fhir-context/types.js";
import type { ResolveRemoteCanonical } from "./search/dataConversion.js";

export function createResolverRemoteCanonical(
  ctx: FHIRServerCTX,
): ResolveRemoteCanonical {
  return async <FHIRVersion extends FHIR_VERSION>(
    fhirVersion: FHIRVersion,
    types: VersionedResourceType<FHIRVersion>[],
    url: canonical,
  ) => {
    const results = await ctx.client.search_system(ctx, fhirVersion, [
      { name: "_type", value: types },
      { name: "url", value: [url] },
    ]);

    if (results.resources.length !== 1) {
      return undefined;
    }

    return results.resources[0] as
      | VersionedAResource<FHIRVersion, VersionedResourceType<FHIRVersion>>
      | undefined;
  };
}
