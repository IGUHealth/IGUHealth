import type { Logger } from "pino";

import {
  CapabilityStatement,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  outcome,
  outcomeError,
} from "@iguhealth/operation-outcomes";
import { createMiddlewareAsync } from "@iguhealth/client/middleware";
import { FHIRClientAsync } from "@iguhealth/client/interface";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/types";
import validate from "@iguhealth/fhir-validation";

import { Lock } from "./synchronization/interfaces.js";
import { IOCache } from "./cache/interface.js";

async function fhirRequestToFHIRResponse(
  ctx: FHIRServerCTX,
  request: FHIRRequest
): Promise<FHIRResponse> {
  if (request.type === "capabilities-request") {
    return {
      level: "system",
      type: "capabilities-response",
      body: ctx.capabilities,
    };
  }
  return ctx.client.request(ctx, request);
}

export interface FHIRServerCTX {
  workspace: string;
  author: string;

  // Services setup
  logger: Logger<unknown>;
  capabilities: CapabilityStatement;
  cache: IOCache<FHIRServerCTX>;
  client: FHIRClientAsync<FHIRServerCTX>;
  lock: Lock<unknown>;
  user_access_token?: string;
  resolveSD: (
    ctx: FHIRServerCTX,
    type: string
  ) => StructureDefinition | undefined;
}

function getResourceTypeToValidate(request: FHIRRequest) {
  switch (request.type) {
    case "create-request":
      return request.resourceType || request.body.resourceType;
    case "update-request":
      return request.resourceType;
    case "invoke-request":
      return "Parameters";
    case "transaction-request":
    case "batch-request":
      return "Bundle";
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          `cannot validate resource type '${request.type}'`
        )
      );
  }
}

function createFHIRServer() {
  return createMiddlewareAsync<undefined, FHIRServerCTX>([
    async (request, { state, ctx }, next) => {
      switch (request.type) {
        case "update-request":
        case "create-request":
        case "batch-request":
        case "invoke-request":
        case "transaction-request": {
          const resourceType = getResourceTypeToValidate(request);
          const issues = validate(
            (type) => {
              const sd = ctx.resolveSD(ctx, type);
              if (!sd)
                throw new OperationError(
                  outcomeError(
                    "invalid",
                    `Could not validate type of ${resourceType}`
                  )
                );
              return sd;
            },
            resourceType,
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
