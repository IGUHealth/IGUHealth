import {
  CapabilityStatement,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  outcome,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { createMiddlewareAsync } from "./client/middleware/index.js";
import { FHIRClient } from "./client/interface.js";
import { FHIRRequest, FHIRResponse } from "./client/types";
import validate from "@iguhealth/fhir-validation";

async function fhirRequestToFHIRResponse(
  ctx: FHIRServerCTX,
  request: FHIRRequest
): Promise<FHIRResponse> {
  return ctx.database.request(ctx, request);
}

export interface FHIRServerCTX {
  workspace: string;
  author: string;

  // Services setup
  capabilities: CapabilityStatement;
  database: FHIRClient<FHIRServerCTX>;
  resolveSD: (
    ctx: FHIRServerCTX,
    type: string
  ) => StructureDefinition | undefined;
}

function createFHIRServer() {
  return createMiddlewareAsync<undefined, FHIRServerCTX>([
    async (request, { state, ctx }, next) => {
      switch (request.type) {
        case "update-request":
        case "create-request":
        case "batch-request":
        case "transaction-request": {
          const issues = validate(
            (type) => {
              const sd = ctx.resolveSD(ctx, type);
              if (!sd)
                throw new OperationError(
                  outcomeError(
                    "invalid",
                    `Could not validate type of ${request.body.resourceType}`
                  )
                );
              return sd;
            },
            request.body.resourceType,
            request.body
          );
          if (issues.length > 0) {
            throw new OperationError(outcome(issues));
          }
          break;
        }
        case "patch-request": {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Operation '${request.type}' not supported`
            )
          );
        }
        case "invoke-request": {
        }
      }
      if (!next) throw new Error("No next");
      return next(request, { state, ctx });
    },
    async (request, { state, ctx }, next) => {
      return {
        state,
        ctx,
        response: await fhirRequestToFHIRResponse(ctx, request),
      };
    },
  ]);
}

export default createFHIRServer;
