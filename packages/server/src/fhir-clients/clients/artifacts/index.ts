import { AsynchronousClient } from "@iguhealth/client";
import {
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  AllResourceTypes,
  FHIR_VERSION,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { FHIRClient } from "@iguhealth/client/lib/interface";

const ArtifactTypes: AllResourceTypes[] = [
  "CodeSystem",
  "ValueSet",
  "StructureDefinition",
  "SearchParameter",
];

type ArtifactConfig = {
  artifactTenant: TenantId;
};

/**
 * Create a remote storage client.
 * @param param0 Options for the storage client.
 * @returns FHIRClient
 */
export function createRequestToResponse<CTX extends IGUHealthServerCTX>({artifactTenant}: ArtifactConfig): FHIRClient<CTX> {
  return new AsynchronousClient<, CTX>(
    {
      transaction_entry_limit,
    },
    createMiddlewareAsync(
      [createRequestToResponseMiddleware(), ...middleware],
      {
        logging: false,
      },
    ),
  );
}
