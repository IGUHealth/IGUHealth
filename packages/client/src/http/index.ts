import { MiddlewareAsync, createMiddlewareAsync } from "../middleware/index.js";
import { AsynchronousClient } from "../index.js";
import { FHIRRequest, FHIRResponse } from "../types";
import { ParsedParameter } from "../url.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import {
  Bundle,
  CapabilityStatement,
  OperationOutcome,
  Parameters,
  Resource,
} from "@iguhealth/fhir-types";

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

function httpResponseToFHIRResponse(
  request: FHIRRequest,
  response: Response
): FHIRResponse {
  if (response.status >= 400) {
    try {
      if (!response.body) throw new Error(response.statusText);
      const oo = JSON.parse(response.body?.toString()) as OperationOutcome;
      throw new OperationError(oo);
    } catch (e) {
      throw e;
    }
  }
  switch (request.type) {
    case "invoke-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const parameters = JSON.parse(response.body.toString()) as Parameters;
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
    }
    case "read-request":
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const resource = JSON.parse(response.body.toString()) as Resource;
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
      const vresource = JSON.parse(response.body.toString()) as Resource;
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
      const uresource = JSON.parse(response.body.toString()) as Resource;

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
      const presource = JSON.parse(response.body.toString()) as Resource;
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

    case "history-request":
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const hresource = JSON.parse(response.body.toString()) as Bundle;
      const resources =
        hresource.entry
          ?.map((e) => e.resource)
          .filter((r): r is Resource => r !== undefined) || [];
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

    case "create-request":
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const cresource = JSON.parse(response.body.toString()) as Resource;
      return {
        type: "create-response",
        level: "type",
        resourceType: request.resourceType,
        body: cresource,
      };

    case "search-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const bundle = JSON.parse(response.body.toString()) as Bundle;
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
            body: resources,
          };
        }
        case "type": {
          return {
            type: "search-response",
            level: "type",
            parameters: request.parameters,
            resourceType: request.resourceType,
            body: resources,
          };
        }
      }
    }

    case "capabilities-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const capabilities = JSON.parse(
        response.body.toString()
      ) as CapabilityStatement;
      return {
        level: "system",
        type: "capabilities-response",
        body: capabilities,
      };
    }

    case "batch-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const batch = JSON.parse(response.body.toString()) as Bundle;
      return {
        type: "batch-response",
        level: "system",
        body: batch,
      };
    }

    case "transaction-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const transaction = JSON.parse(response.body.toString()) as Bundle;
      return {
        type: "batch-response",
        level: "system",
        body: transaction,
      };
    }
  }
}

function httpMiddleware(): MiddlewareAsync<HTTPClientState, {}> {
  return createMiddlewareAsync<HTTPClientState, {}>([
    async (request, args, next) => {
      const httpRequest = toHTTPRequest(args.state, request);
      const response = await fetch(httpRequest.url, {
        method: httpRequest.method,
        headers: httpRequest.headers,
        body: httpRequest.body,
      });

      return {
        ctx: args.ctx,
        state: args.state,
        response: httpResponseToFHIRResponse(request, response),
      };
    },
  ]);
}

export function createHTTPClient(
  initialState: HTTPClientState
): AsynchronousClient<HTTPClientState, {}> {
  const middleware = httpMiddleware();
  return new AsynchronousClient<HTTPClientState, {}>(initialState, middleware);
}
