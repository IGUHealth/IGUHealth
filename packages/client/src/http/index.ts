import { createMiddlewareAsync } from "../middleware/index.js";
import { AsynchronousClient } from "../index.js";
import { FHIRRequest } from "../types";

type HTTPClientState = { token: string; url: string };

function toHTTPRequest(
  state: HTTPClientState,
  request: FHIRRequest
): {
  url: string;
  headers?: Record<string, string>;
  method: string;
  body?: string;
} {
  switch (request.type) {
    case "capabilities-request":
      return { url: `${state.url}/metadata`, method: "GET" };

    case "create-request":
      return {
        url: `${state.url}/${request.resourceType}`,
        method: "POST",
        body: JSON.stringify(request.body),
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };
    case "update-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}`,
        method: "PUT",
        body: JSON.stringify(request.body),
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };

    case "patch-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}`,
        method: "PATCH",
        body: JSON.stringify(request.body),
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };

    case "read-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };
    case "vread-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}/_history/${request.vid}`,
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };

    case "delete-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };

    case "history-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}/_history`,
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };

    case "batch-request":
    case "transaction-request":
      return {
        url: `${state.url}`,
        method: "POST",
        body: JSON.stringify(request.body),
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };
    case "search-request":
      return {
        url: `${state.url}/${request.resourceType}`,
        method: "GET",
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };

    case "invoke-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}/$${request.operation}`,
        method: "POST",
        body: JSON.stringify(request.body),
        headers: {
          "Content-Type": "application/fhir+json",
        },
      };
  }
}

function httpMiddleware() {
  createMiddlewareAsync<HTTPClientState, {}>([
    async (request, args, next) => {
      const httpRequest = toHTTPRequest(args.state, request);
      const response = await fetch(httpRequest.url, {
        method: httpRequest.method,
        headers: httpRequest.headers,
        body: httpRequest.body,
      });

      return next();
    },
  ]);
}
