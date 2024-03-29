import {
  Bundle,
  CapabilityStatement,
  OperationOutcome,
  Parameters,
  Resource,
} from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { AsynchronousClient } from "../index.js";
import { MiddlewareAsync, createMiddlewareAsync } from "../middleware/index.js";
import { FHIRRequest, FHIRResponse } from "../types.js";
import { ParsedParameter } from "../url.js";

type HTTPClientState = {
  getAccessToken?: () => Promise<string>;
  url: string;
  headers?: Record<string, string>;
};

function parametersToQueryString(
  parameters: ParsedParameter<string | number>[],
): string {
  return parameters
    .map((p) => {
      const name = p.chains ? [p.name, ...p.chains].join(".") : p.name;
      return `${name}${p.modifier ? `:${p.modifier}` : ""}=${p.value.map((v) => encodeURIComponent(v)).join(",")}`;
    })
    .join("&");
}

async function toHTTPRequest(
  state: HTTPClientState,
  request: FHIRRequest,
): Promise<{
  url: string;
  headers?: Record<string, string>;
  method: string;
  body?: string;
}> {
  const headers: Record<string, any> = {
    "Content-Type": "application/json", //"application/fhir+json"
    ...state.headers,
  };
  if (state.getAccessToken) {
    const token = await state.getAccessToken();
    headers["Authorization"] = `Bearer ${token}`;
  }
  switch (request.type) {
    case "capabilities-request":
      return { headers, url: `${state.url}/metadata`, method: "GET" };

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
      const queryString = parametersToQueryString(request.parameters || []);
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
        url: `${url}${queryString ? `?${queryString}` : ""}`,
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
      const queryString = parametersToQueryString(request.parameters);
      let url;
      switch (request.level) {
        case "type":
          url = `${state.url}/${request.resourceType}${
            queryString ? `?${queryString}` : ""
          }`;
          break;
        case "system":
          url = `${state.url}${queryString ? `?${queryString}` : ""}`;
          break;
      }

      return {
        url,
        method: "GET",
        headers,
      };
    }

    case "invoke-request": {
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
}

async function httpResponseToFHIRResponse(
  request: FHIRRequest,
  response: Response,
): Promise<FHIRResponse> {
  if (response.status >= 400) {
    if (!response.body) throw new Error(response.statusText);
    const oo = (await response.json()) as OperationOutcome;
    throw new OperationError(oo);
  }
  switch (request.type) {
    case "invoke-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const parameters = (await response.json()) as Parameters;
      switch (request.level) {
        case "system": {
          return {
            type: "invoke-response",
            operation: request.operation,
            level: "system",
            body: parameters,
          };
        }
        case "type": {
          return {
            type: "invoke-response",
            operation: request.operation,
            level: "type",
            resourceType: request.resourceType,
            body: parameters,
          };
        }
        case "instance": {
          return {
            type: "invoke-response",
            operation: request.operation,
            level: "instance",
            resourceType: request.resourceType,
            id: request.id,
            body: parameters,
          };
        }
      }
      throw new OperationError(outcomeError("exception", "Invalid level"));
    }
    case "read-request":
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const resource = (await response.json()) as Resource;
      return {
        level: "instance",
        type: "read-response",
        resourceType: request.resourceType,
        id: request.id,
        body: resource,
      };

    case "vread-request":
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const vresource = (await response.json()) as Resource;
      return {
        level: "instance",
        type: "vread-response",
        resourceType: request.resourceType,
        id: request.id,
        versionId: request.versionId,
        body: vresource,
      };
    case "update-request":
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const uresource = (await response.json()) as Resource;

      return {
        type: "update-response",
        level: "instance",
        resourceType: request.resourceType,
        id: request.id,
        body: uresource,
      };
    case "patch-request":
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const presource = (await response.json()) as Resource;
      return {
        type: "patch-response",
        level: "instance",
        resourceType: request.resourceType,
        id: request.id,
        body: presource,
      };

    case "delete-request":
      return {
        type: "delete-response",
        level: "instance",
        resourceType: request.resourceType,
        id: request.id,
      };

    case "history-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));

      const hresource = (await response.json()) as Bundle;
      const resources = hresource.entry || [];
      switch (request.level) {
        case "system": {
          return {
            type: "history-response",
            level: "system",
            body: resources,
          };
        }
        case "type": {
          return {
            type: "history-response",
            level: "type",
            resourceType: request.resourceType,
            body: resources,
          };
        }
        case "instance": {
          return {
            type: "history-response",
            level: "instance",
            resourceType: request.resourceType,
            id: request.id,
            body: resources,
          };
        }
      }
      throw new OperationError(outcomeError("exception", "Invalid level"));
    }

    case "create-request":
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const cresource = (await response.json()) as Resource;
      return {
        type: "create-response",
        level: "type",
        resourceType: request.resourceType,
        body: cresource,
      };

    case "search-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const bundle = (await response.json()) as Bundle;
      const resources =
        bundle.entry
          ?.map((e) => e.resource)
          .filter((r): r is Resource => r !== undefined) || [];
      switch (request.level) {
        case "system": {
          return {
            type: "search-response",
            level: "system",
            parameters: request.parameters,
            total: bundle.total,
            body: resources,
          };
        }
        case "type": {
          return {
            type: "search-response",
            level: "type",
            parameters: request.parameters,
            resourceType: request.resourceType,
            total: bundle.total,
            body: resources,
          };
        }
      }
      throw new OperationError(outcomeError("exception", "Invalid level"));
    }

    case "capabilities-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const capabilities = (await response.json()) as CapabilityStatement;
      return {
        level: "system",
        type: "capabilities-response",
        body: capabilities,
      };
    }

    case "batch-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const batch = (await response.json()) as Bundle;
      return {
        type: "batch-response",
        level: "system",
        body: batch,
      };
    }

    case "transaction-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const transaction = (await response.json()) as Bundle;
      return {
        type: "transaction-response",
        level: "system",
        body: transaction,
      };
    }
  }
}

function httpMiddleware(): MiddlewareAsync<HTTPClientState, unknown> {
  return createMiddlewareAsync<HTTPClientState, unknown>([
    async (context) => {
      const httpRequest = await toHTTPRequest(context.state, context.request);
      const response = await fetch(httpRequest.url, {
        method: httpRequest.method,
        headers: httpRequest.headers,
        body: httpRequest.body,
      });

      return {
        ...context,
        response: await httpResponseToFHIRResponse(context.request, response),
      };
    },
  ]);
}

export default function createHTTPClient(
  initialState: HTTPClientState,
): AsynchronousClient<HTTPClientState, unknown> {
  // Removing trailing slash
  if (initialState.url.endsWith("/"))
    initialState.url = initialState.url.slice(0, -1);
  const middleware = httpMiddleware();
  return new AsynchronousClient<HTTPClientState, unknown>(
    initialState,
    middleware,
  );
}
