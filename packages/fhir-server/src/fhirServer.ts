import Koa from "koa";

import parseQuery, { FHIRURL } from "@iguhealth/fhir-query";
import {
  CapabilityStatement,
  StructureDefinition,
  Resource,
} from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  outcome,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { createMiddlewareAsync } from "./client/middleware/index.js";
import { FHIRClient } from "./client/interface.js";
import {
  FHIRRequest,
  FHIRResponse,
  RequestLevel,
  TypeLevelInteractions,
  InstanceLevelInteraction,
  SystemInteraction,
} from "./client/types";
import validate from "@iguhealth/fhir-validation";

function getInteractionLevel(
  fhirURL: FHIRURL
): RequestLevel[keyof RequestLevel] {
  if (fhirURL.resourceType && fhirURL.id) {
    return "instance";
  } else if (fhirURL.resourceType !== undefined) {
    return "type";
  }
  return "system";
}

function parseInstantRequest(
  request: Koa.Request,
  fhirURL: FHIRURL,
  fhirRequest: Pick<InstanceLevelInteraction, "level" | "resourceType" | "id">
): FHIRRequest {
  switch (request.method) {
    case "GET":
      return {
        type: "read-request",
        ...fhirRequest,
      };
    case "PUT":
      return {
        type: "update-request",
        body: request.body as Resource,
        ...fhirRequest,
      };
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Instance interaction '${request.method}' not supported`
        )
      );
  }
}

function parseTypeRequest(
  request: Koa.Request,
  fhirURL: FHIRURL,
  fhirRequest: Pick<TypeLevelInteractions, "level" | "resourceType">
): FHIRRequest {
  switch (request.method) {
    case "GET":
      return {
        query: fhirURL,
        type: "search-request",
        ...fhirRequest,
      };
    case "POST":
      return {
        type: "create-request",
        body: request.body as Resource,
        ...fhirRequest,
      };
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Type interaction '${request.method}' not supported`
        )
      );
  }
}

function parseSystemRequest(
  request: Koa.Request,
  fhirURL: FHIRURL,
  fhirRequest: Pick<SystemInteraction, "level">
): FHIRRequest {
  switch (request.method) {
    case "GET":
      return {
        query: fhirURL,
        type: "search-request",
        ...fhirRequest,
      };
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `System interaction '${request.method}' not supported`
        )
      );
  }
}

function KoaRequestToFHIRRequest(
  url: string,
  request: Koa.Request
): FHIRRequest {
  const fhirQuery = parseQuery(url);
  const level = getInteractionLevel(fhirQuery);

  switch (level) {
    case "instance":
      if (!fhirQuery.resourceType)
        throw new OperationError(
          outcomeError(
            "invalid",
            "Invalid instance search no resourceType found"
          )
        );
      if (!fhirQuery.id)
        throw new OperationError(
          outcomeError("invalid", "Invalid instance search no ID found")
        );

      return parseInstantRequest(request, fhirQuery, {
        level: "instance",
        id: fhirQuery.id,
        resourceType: fhirQuery.resourceType,
      });
    case "type":
      if (!fhirQuery.resourceType)
        throw new OperationError(
          outcomeError("invalid", "Invalid Type search no resourceType found")
        );
      return parseTypeRequest(request, fhirQuery, {
        level: "type",
        resourceType: fhirQuery.resourceType,
      });
    case "system":
      return parseSystemRequest(request, fhirQuery, {
        level: "system",
      });
  }
}

async function fhirRequestToFHIRResponse(
  ctx: FHIRServerCTX,
  request: FHIRRequest
): Promise<FHIRResponse> {
  return ctx.database.request(ctx, request);
}

export type FHIRServerCTX = {
  workspace: string;
  author: string;

  // Services setup
  capabilities: CapabilityStatement;
  database: FHIRClient<FHIRServerCTX>;
  resolveSD: (
    ctx: FHIRServerCTX,
    type: string
  ) => StructureDefinition | undefined;
};

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
        default:
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
