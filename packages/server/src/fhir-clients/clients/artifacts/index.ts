import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClient } from "@iguhealth/client/lib/interface";
import { createMiddlewareAsync } from "@iguhealth/client/middleware";
import { AllResourceTypes } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import validateResourceTypesAllowedMiddleware from "../../middleware/validate-resourcetype.js";

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
export function createRequestToResponse<CTX extends IGUHealthServerCTX>(
  artifactConfig: ArtifactConfig,
): FHIRClient<CTX> {
  return new AsynchronousClient<ArtifactConfig, CTX>(
    artifactConfig,
    createMiddlewareAsync(
      [validateResourceTypesAllowedMiddleware(ArtifactTypes)],
      {
        logging: false,
      },
    ),
  );
}
