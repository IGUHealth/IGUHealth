import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRRequest } from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { ResourceType } from "@iguhealth/fhir-types/r4/types";

import { asRoot, IGUHealthServerCTX } from "../../../fhir-api/types.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";
import validateResourceTypesAllowedMiddleware from "../../middleware/validate-resourcetype.js";
import { createPostgresClient } from "../postgres/index.js";
import { TenantId } from "@iguhealth/jwt";

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
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    validateResourceTypesAllowedMiddleware(TERMINOLOGY_RESOURCETYPES),
    validateOperationsAllowed(TERMINOLOGY_METHODS_ALLOWED),
    async (context) => {
      const id = Math.floor(Math.random() * 1000);
      console.time(`${id} REQUEST ${JSON.stringify(context.request)}`);
      const response = await context.state.fhirDB.request(
        asRoot({ ...context.ctx, tenant: "iguhealth" as TenantId }),
        context.request,
      );
      console.timeEnd(`${id} REQUEST ${JSON.stringify(context.request)}`);

      return {
        ...context,
        response,
      };
    },
  ]);
}

export function createTerminologyClient<CTX extends IGUHealthServerCTX>(
  fhirDB: ReturnType<typeof createPostgresClient>,
): FHIRClientAsync<CTX> {
  return new AsynchronousClient<
    { fhirDB: ReturnType<typeof createPostgresClient> },
    CTX
  >({ fhirDB }, createTerminologyMiddleware());
}
