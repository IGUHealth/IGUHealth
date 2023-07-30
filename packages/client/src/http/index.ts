import { createMiddlewareAsync } from "../middleware/index.js";
import { AsynchronousClient } from "../index.js";
import { FHIRRequest } from "../types";
import { ParsedParameter } from "../url.js";

type HTTPClientState = { token: string; url: string };

function parametersToQueryString(
  parameters: ParsedParameter<string | number>[]
): string {
  return parameters
    .map((p) => `${p.name}${p.modifier ? `:${p.modifier}` : ""}=${p.value}`)
    .join("&");
}

function toHTTPRequest(
  state: HTTPClientState,
  request: FHIRRequest
): {
  url: string;
  headers?: Record<string, string>;
  method: string;
  body?: string;
} {
  const headers = {
    "Content-Type": "application/fhir+json",
    Authorization: `Bearer ${state.token}`,
  };
  switch (request.type) {
    case "capabilities-request":
      return { url: `${state.url}/metadata`, method: "GET" };

    case "create-request":
      return {
        url: `${state.url}/${request.resourceType}`,
        method: "POST",
        body: JSON.stringify(request.body),
        headers,
      };
    case "update-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}`,
        method: "PUT",
        body: JSON.stringify(request.body),
        headers,
      };

    case "patch-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}`,
        method: "PATCH",
        body: JSON.stringify(request.body),
        headers,
      };

    case "read-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}`,
        method: "GET",
        headers,
      };
    case "vread-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}/_history/${request.versionId}`,
        method: "GET",
        headers,
      };

    case "delete-request":
      return {
        url: `${state.url}/${request.resourceType}/${request.id}`,
        method: "DELETE",
        headers,
      };

    case "history-request": {
      let url;
      switch (request.level) {
        case "instance":
          url = `${state.url}/${request.resourceType}/${request.id}/_history`;
          break;
        case "type":
          url = `${state.url}/${request.resourceType}/_history`;
          break;
        case "system":
          url = `${state.url}/_history`;
          break;
      }

      return {
        url: url,
        method: "GET",
        headers,
      };
    }

    case "batch-request":
    case "transaction-request":
      return {
        url: `${state.url}`,
        method: "POST",
        body: JSON.stringify(request.body),
        headers,
      };
    case "search-request": {
      const querySring = parametersToQueryString(request.parameters);
      let url;
      switch (request.level) {
        case "type":
          url = `${state.url}/${request.resourceType}${
            querySring ? `?${querySring}` : ""
          }`;
          break;
        case "system":
          url = `${state.url}${querySring ? `?${querySring}` : ""}`;
          break;
      }

      return {
        url,
        method: "GET",
        headers,
      };
    }

    case "invoke-request":
      let url;
      switch (request.level) {
        case "instance":
          url = `${state.url}/${request.resourceType}/${request.id}/$${request.operation}`;
          break;
        case "type":
          url = `${state.url}/${request.resourceType}/$${request.operation}`;
          break;
        case "system":
          url = `${state.url}/$${request.operation}`;
          break;
      }
      return {
        url: url,
        method: "POST",
        body: JSON.stringify(request.body),
        headers,
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

      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    },
  ]);
}
