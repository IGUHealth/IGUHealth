import Koa from "koa";

import parseQuery, { FHIRURL } from "@genfhi/fhir-query";
import {
  CapabilityStatement,
  StructureDefinition,
  ResourceType,
} from "@genfhi/fhir-types/r4/types";

import { FHIRClient } from "./database/types";
import {
  FHIRRequest,
  FHIRResponse,
  InteractionLevel,
  InstanceLevelInteraction,
} from "./types";
import chain from "./chain";

function getInteractionLevel(
  fhirURL: FHIRURL
): InteractionLevel[keyof InteractionLevel] {
  if (fhirURL.resourceType && fhirURL.id) {
    return "instance";
  } else if (fhirURL.resourceType) {
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
        url: fhirURL,
        type: "read",
        ...fhirRequest,
      };
    default:
      throw new Error(`Instance interaction '${request.method}' not supported`);
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
        throw new Error("Invalid instance search no resourceType found");
      if (!fhirQuery.id) throw new Error("Invalid instance search no ID found");
      return parseInstantRequest(request, fhirQuery, {
        level: "instance",
        id: fhirQuery.id,
        resourceType: fhirQuery.resourceType,
      });
    case "type":
      if (!fhirQuery.resourceType) throw new Error("Invalid Type search");
      return {
        url: fhirQuery,
        type: "search",
        level: "type",
        resourceType: fhirQuery.resourceType,
      };
    case "system":
      return {
        url: fhirQuery,
        level: "system",
        type: "batch",
      };
  }
}

async function fhirRequestToFHIRResponse(
  ctx: FHIRServerCTX,
  request: FHIRRequest
): Promise<FHIRResponse> {
  switch (request.level) {
    case "system":
      throw new Error("not Implemented");
    case "type":
      switch (request.type) {
        case "search":
          return {
            resourceType: request.resourceType,
            type: request.type,
            level: request.level,
            body: {
              resourceType: "Bundle",
              type: "search",
              entry: (
                await ctx.database.search_type(
                  ctx,
                  request.resourceType as ResourceType,
                  request.url.parameters
                )
              ).map((resource) => ({
                resource: resource,
              })),
            },
          };
        default:
          throw new Error("not Implemented");
      }
    case "instance":
      throw new Error("not Implemented");
  }
}

function fhirResponseToKoaResponse(
  fhirResponse: FHIRResponse
): Partial<Koa.Response> {
  switch (fhirResponse.level) {
    case "system":
      throw new Error("not Implemented");
    case "type":
      switch (fhirResponse.type) {
        case "search":
          return {
            status: 200,
            body: fhirResponse.body,
          };
        default:
          throw new Error("not Implemented");
      }
    case "instance":
      throw new Error("not Implemented");
  }
}

export type FHIRServerCTX = {
  capabilities: CapabilityStatement;
  database: FHIRClient<FHIRServerCTX>;
  resolveSD: (
    ctx: FHIRServerCTX,
    type: string
  ) => StructureDefinition | undefined;
};

const createFhirServer =
  (serverCtx: FHIRServerCTX) => (ctx: Koa.Context, request: Koa.Request) =>
    chain(
      request,
      (request: Koa.Request) =>
        KoaRequestToFHIRRequest(
          `${ctx.params.fhirUrl}?${request.querystring}`,
          request
        ),
      (request: FHIRRequest): [FHIRServerCTX, FHIRRequest] => [
        serverCtx,
        request,
      ],
      async ([ctx, request]): Promise<FHIRResponse> =>
        fhirRequestToFHIRResponse(ctx, request),
      async (
        fhirResponse: Promise<FHIRResponse>
      ): Promise<Partial<Koa.Response>> => fhirResponse
    );

export default createFhirServer;
