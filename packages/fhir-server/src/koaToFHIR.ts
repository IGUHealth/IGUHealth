import Koa from "koa";

import parseQuery, { FHIRURL } from "@iguhealth/fhir-query";
import { Resource } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import {
  FHIRRequest,
  RequestLevel,
  TypeInteraction,
  InstanceInteraction,
  SystemInteraction,
} from "./client/types";

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
  fhirRequest: Pick<InstanceInteraction, "level" | "resourceType" | "id">
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
  fhirRequest: Pick<TypeInteraction, "level" | "resourceType">
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

export function KoaRequestToFHIRRequest(
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
