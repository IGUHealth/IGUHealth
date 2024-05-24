import {
  Bundle,
  OperationOutcome,
  Resource,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { AsynchronousClient } from "../index.js";
import { MiddlewareAsync, createMiddlewareAsync } from "../middleware/index.js";
import { FHIRRequest, FHIRResponse } from "../types/index.js";
import { ParsedParameter } from "../url.js";

type HTTPClientState = {
  onAuthenticationError?: () => void;
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

const pathJoin = (parts: string[], sep = "/") =>
  parts.join(sep).replace(new RegExp(sep + "{1,}", "g"), sep);

function fhirUrlChunk(version: string) {
  switch (version) {
    case R4:
      return "r4";
    case R4B:
      return "r4b";
    default:
      return version;
  }
}

function versionUrl(domain: string, fhirVersion: FHIR_VERSION): string {
  return new URL(
    pathJoin([
      new URL(domain).pathname,
      `/api/v1/fhir/${fhirUrlChunk(fhirVersion)}`,
    ]),
    domain,
  ).toString();
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
    "Content-Type": "application/fhir+json",
    ...state.headers,
  };
  const FHIRUrl = versionUrl(state.url, request.fhirVersion);
  if (state.getAccessToken) {
    const token = await state.getAccessToken();
    headers["Authorization"] = `Bearer ${token}`;
  }
  switch (request.type) {
    case "capabilities-request":
      return { headers, url: `${FHIRUrl}/metadata`, method: "GET" };

    case "create-request":
      return {
        url: `${FHIRUrl}/${request.resourceType}`,
        method: "POST",
        body: JSON.stringify(request.body),
        headers,
      };
    case "update-request":
      return {
        url: `${FHIRUrl}/${request.resourceType}/${request.id}`,
        method: "PUT",
        body: JSON.stringify(request.body),
        headers,
      };

    case "patch-request":
      return {
        url: `${FHIRUrl}/${request.resourceType}/${request.id}`,
        method: "PATCH",
        body: JSON.stringify(request.body),
        headers,
      };

    case "read-request":
      return {
        url: `${FHIRUrl}/${request.resourceType}/${request.id}`,
        method: "GET",
        headers,
      };
    case "vread-request":
      return {
        url: `${FHIRUrl}/${request.resourceType}/${request.id}/_history/${request.versionId}`,
        method: "GET",
        headers,
      };

    case "delete-request":
      return {
        url: `${FHIRUrl}/${request.resourceType}/${request.id}`,
        method: "DELETE",
        headers,
      };

    case "history-request": {
      let url;
      const queryString = parametersToQueryString(request.parameters || []);
      switch (request.level) {
        case "instance":
          url = `${FHIRUrl}/${request.resourceType}/${request.id}/_history`;
          break;
        case "type":
          url = `${FHIRUrl}/${request.resourceType}/_history`;
          break;
        case "system":
          url = `${FHIRUrl}/_history`;
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
        url: `${FHIRUrl}`,
        method: "POST",
        body: JSON.stringify(request.body),
        headers,
      };
    case "search-request": {
      const queryString = parametersToQueryString(request.parameters);
      let url;
      switch (request.level) {
        case "type":
          url = `${FHIRUrl}/${request.resourceType}${
            queryString ? `?${queryString}` : ""
          }`;
          break;
        case "system":
          url = `${FHIRUrl}${queryString ? `?${queryString}` : ""}`;
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
          url = `${FHIRUrl}/${request.resourceType}/${request.id}/$${request.operation}`;
          break;
        case "type":
          url = `${FHIRUrl}/${request.resourceType}/$${request.operation}`;
          break;
        case "system":
          url = `${FHIRUrl}/$${request.operation}`;
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
    switch (response.status) {
      case 401: {
        throw new OperationError(outcomeError("login", "Unauthorized"));
      }
      case 403: {
        throw new OperationError(outcomeError("forbidden", "Forbidden"));
      }
      default: {
        if (!response.body) throw new Error(response.statusText);
        const oo = (await response.json()) as OperationOutcome;
        throw new OperationError(oo);
      }
    }
  }
  switch (request.type) {
    case "invoke-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const parameters = await response.json();
      switch (request.level) {
        case "system": {
          return {
            fhirVersion: request.fhirVersion,
            type: "invoke-response",
            operation: request.operation,
            level: "system",
            body: parameters,
          } as FHIRResponse;
        }
        case "type": {
          return {
            fhirVersion: request.fhirVersion,
            type: "invoke-response",
            operation: request.operation,
            level: "type",
            resourceType: request.resourceType,
            body: parameters,
          } as FHIRResponse;
        }
        case "instance": {
          return {
            fhirVersion: request.fhirVersion,
            type: "invoke-response",
            operation: request.operation,
            level: "instance",
            resourceType: request.resourceType,
            id: request.id,
            body: parameters,
          } as FHIRResponse;
        }
      }
      throw new OperationError(outcomeError("exception", "Invalid level"));
    }
    case "read-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const resource = await response.json();
      return {
        fhirVersion: request.fhirVersion,
        level: "instance",
        type: "read-response",
        resourceType: request.resourceType,
        id: request.id,
        body: resource,
      } as FHIRResponse;
    }

    case "vread-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const vresource = await response.json();
      return {
        fhirVersion: request.fhirVersion,
        level: "instance",
        type: "vread-response",
        resourceType: request.resourceType,
        id: request.id,
        versionId: request.versionId,
        body: vresource,
      } as FHIRResponse;
    }
    case "update-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const uresource = await response.json();

      return {
        fhirVersion: request.fhirVersion,
        type: "update-response",
        level: "instance",
        resourceType: request.resourceType,
        id: request.id,
        body: uresource,
      } as FHIRResponse;
    }
    case "patch-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const presource = await response.json();
      return {
        fhirVersion: request.fhirVersion,
        type: "patch-response",
        level: "instance",
        resourceType: request.resourceType,
        id: request.id,
        body: presource,
      } as FHIRResponse;
    }

    case "delete-request": {
      return {
        fhirVersion: request.fhirVersion,
        type: "delete-response",
        level: "instance",
        resourceType: request.resourceType,
        id: request.id,
      } as FHIRResponse;
    }

    case "history-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));

      const hresource = await response.json();
      const resources = hresource.entry || [];
      switch (request.level) {
        case "system": {
          return {
            fhirVersion: request.fhirVersion,
            type: "history-response",
            level: "system",
            body: resources,
          } as FHIRResponse;
        }
        case "type": {
          return {
            fhirVersion: request.fhirVersion,
            type: "history-response",
            level: "type",
            resourceType: request.resourceType,
            body: resources,
          } as FHIRResponse;
        }
        case "instance": {
          return {
            fhirVersion: request.fhirVersion,
            type: "history-response",
            level: "instance",
            resourceType: request.resourceType,
            id: request.id,
            body: resources,
          } as FHIRResponse;
        }
      }
      throw new OperationError(outcomeError("exception", "Invalid level"));
    }

    case "create-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const resource = await response.json();
      return {
        fhirVersion: request.fhirVersion,
        type: "create-response",
        level: "type",
        resourceType: request.resourceType,
        body: resource,
      } as FHIRResponse;
    }

    case "search-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const bundle = (await response.json()) as Bundle | r4b.Bundle;
      const resources =
        bundle.entry
          ?.map((e) => e.resource)
          .filter((r): r is Resource => r !== undefined) || [];
      switch (request.level) {
        case "system": {
          return {
            fhirVersion: request.fhirVersion,
            type: "search-response",
            level: "system",
            parameters: request.parameters,
            total: bundle.total,
            body: resources,
          } as FHIRResponse;
        }
        case "type": {
          return {
            fhirVersion: request.fhirVersion,
            type: "search-response",
            level: "type",
            parameters: request.parameters,
            resourceType: request.resourceType,
            total: bundle.total,
            body: resources,
          } as FHIRResponse;
        }
      }
      throw new OperationError(outcomeError("exception", "Invalid level"));
    }

    case "capabilities-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const capabilities = await response.json();
      return {
        fhirVersion: request.fhirVersion,
        level: "system",
        type: "capabilities-response",
        body: capabilities,
      };
    }

    case "batch-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const batch = await response.json();
      return {
        fhirVersion: request.fhirVersion,
        type: "batch-response",
        level: "system",
        body: batch,
      };
    }

    case "transaction-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const transaction = await response.json();
      return {
        fhirVersion: request.fhirVersion,
        type: "transaction-response",
        level: "system",
        body: transaction,
      };
    }
  }
}

function httpMiddleware<CTX>(): MiddlewareAsync<HTTPClientState, CTX> {
  return createMiddlewareAsync<HTTPClientState, CTX>([
    async (context) => {
      try {
        const httpRequest = await toHTTPRequest(context.state, context.request);
        const response = await fetch(httpRequest.url, {
          method: httpRequest.method,
          headers: httpRequest.headers,
          body: httpRequest.body,
        });
        const fhirResponse = await httpResponseToFHIRResponse(
          context.request,
          response,
        );

        return {
          ...context,
          response: fhirResponse,
        };
      } catch (e) {
        if (e instanceof OperationError) {
          if (e.operationOutcome.issue[0].code === "login") {
            if (context.state.onAuthenticationError) {
              context.state.onAuthenticationError();
            }
          }
        }
        throw e;
      }
    },
  ]);
}

export default function createHTTPClient<CTX>(
  initialState: HTTPClientState,
): AsynchronousClient<HTTPClientState, CTX> {
  // Removing trailing slash
  if (initialState.url.endsWith("/"))
    initialState.url = initialState.url.slice(0, -1);
  const middleware = httpMiddleware<CTX>();
  return new AsynchronousClient<HTTPClientState, CTX>(initialState, middleware);
}
