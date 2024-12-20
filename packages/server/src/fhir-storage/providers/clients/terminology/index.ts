import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRRequest } from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { ResourceType } from "@iguhealth/fhir-types/r4/types";
import { TenantId } from "@iguhealth/jwt/types";

import { IGUHealthServerCTX, asRoot } from "../../../../fhir-api/types.js";
import validateOperationsAllowed from "../../../middleware/validate-operations-allowed.js";
import validateResourceTypesAllowedMiddleware from "../../../middleware/validate-resourcetype.js";
import { createRemoteStorage } from "../storage/index.js";

export const TERMINOLOGY_RESOURCETYPES: ResourceType[] = [
  "ValueSet",
  "CodeSystem",
];
export const TERMINOLOGY_METHODS_ALLOWED: FHIRRequest["type"][] = [
  "read-request",
  "search-request",
];

function createTerminologyMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createRemoteStorage>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    validateResourceTypesAllowedMiddleware(TERMINOLOGY_RESOURCETYPES),
    validateOperationsAllowed(TERMINOLOGY_METHODS_ALLOWED),
    async (context) => {
      const response = await context.state.fhirDB.request(
        await asRoot({ ...context.ctx, tenant: "iguhealth" as TenantId }),
        context.request,
      );

      return {
        ...context,
        response,
      };
    },
  ]);
}

export function createTerminologyClient<CTX extends IGUHealthServerCTX>(
  fhirDB: ReturnType<typeof createRemoteStorage>,
): FHIRClientAsync<CTX> {
  return new AsynchronousClient<
    { fhirDB: ReturnType<typeof createRemoteStorage> },
    CTX
  >({ fhirDB }, createTerminologyMiddleware());
}
