import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { canonical } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";

export function createResolverRemoteCanonical<CTX>(
  client: FHIRClientAsync<CTX>,
  ctx: CTX,
): IGUHealthServerCTX["resolveCanonical"] {
  return async <
    FHIRVersion extends FHIR_VERSION,
    Type extends AllResourceTypes,
  >(
    fhirVersion: FHIRVersion,
    type: Type,
    url: canonical,
  ): Promise<Resource<FHIRVersion, Type> | undefined> => {
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
