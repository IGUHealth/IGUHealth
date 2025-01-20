import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";

import { IGUHealthServerCTX } from "../fhir-server/types.js";
import { generateId } from "./utilities/generateId.js";

const AUTHOR_EXTENSION = "https://iguhealth.app/author";

export default function versionResource<
  R extends Resource<FHIR_VERSION, AllResourceTypes>,
>(ctx: IGUHealthServerCTX, resource: R): R {
  const versionId = generateId();
  return {
    ...resource,
    meta: {
      ...resource.meta,
      versionId,
      lastUpdated: new Date().toISOString(),
      // Filters meta extensions for author and places the author reference in the resource.
      extension: (resource.meta?.extension ?? [])
        .filter((e) => e.url !== AUTHOR_EXTENSION)
        .concat([
          {
            url: AUTHOR_EXTENSION as id,
            valueReference: {
              reference: `${ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE]}/${ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID]}`,
            },
          },
        ]),
    },
  };
}
