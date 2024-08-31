import { Bundle, id } from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { AsynchronousClient } from "../index.js";
import { MiddlewareAsync, createMiddlewareAsync } from "../middleware/index.js";
import {
  FHIRRequest,
  FHIRResponse,
  R4BFHIRErrorResponse,
  R4FHIRErrorResponse,
} from "../types/index.js";
import { ParsedParameter } from "../url.js";

type DeriveFHIRURL = (fhirVersion: FHIR_VERSION) => string;
export type HTTPClientState = {
  authenticate?: () => void;
  getAccessToken?: () => Promise<string>;
  url: string | DeriveFHIRURL;
};

export type HTTPContext = {
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

/**
 * Used as default and for display purposes in admin app.
 * @param domain IGUHealth Domain
 * @param fhirVersion FHIRVersion
 * @returns IGUHealth VersionedURL.
 */
export const deriveIGUHealthVersionedURL = (
  domain: string,
  fhirVersion: FHIR_VERSION,
) => {
  return new URL(
    pathJoin([
      new URL(domain).pathname,
      `/api/v1/fhir/${fhirUrlChunk(fhirVersion)}`,
    ]),
    domain,
  ).toString();
};

async function toHTTPRequest(
  state: HTTPClientState,
  context: HTTPContext,
  request: FHIRRequest,
): Promise<{
  url: string;
  headers?: Record<string, string>;
  method: string;
  body?: string;
}> {
  const headers: Record<string, string> = {
    "Content-Type": "application/fhir+json",
    ...context.headers,
  };

  let FHIRUrl =
    typeof state.url === "string"
      ? deriveIGUHealthVersionedURL(state.url, request.fhirVersion)
      : state.url(request.fhirVersion);
  if (!FHIRUrl.endsWith("/")) {
    FHIRUrl = FHIRUrl + "/";
  }

  if (state.getAccessToken) {
    const token = await state.getAccessToken();
    headers["Authorization"] = `Bearer ${token}`;
  }
  switch (request.type) {
    case "capabilities-request": {
      return { headers, url: new URL("metadata", FHIRUrl).href, method: "GET" };
    }

    case "create-request": {
      return {
        url: new URL(request.resource, FHIRUrl).href,
        method: "POST",
        body: JSON.stringify(request.body),
        headers,
      };
    }
    case "update-request": {
      switch (request.level) {
        case "instance": {
          return {
            url: new URL(`${request.resource}/${request.id}`, FHIRUrl).href,
            method: "PUT",
            body: JSON.stringify(request.body),
            headers,
          };
        }
        case "type": {
          const queryString = parametersToQueryString(request.parameters);
          return {
            url: new URL(
              `${request.resource}${queryString ? `?${queryString}` : ""}`,
              FHIRUrl,
            ).href,
            method: "PUT",
            body: JSON.stringify(request.body),
            headers,
          };
        }
        default: {
          throw new OperationError(outcomeError("exception", "Invalid level"));
        }
      }
    }
    case "patch-request": {
      return {
        url: new URL(`${request.resource}/${request.id}`, FHIRUrl).href,
        method: "PATCH",
        body: JSON.stringify(request.body),
        headers,
      };
    }
    case "read-request": {
      return {
        url: new URL(`${request.resource}/${request.id}`, FHIRUrl).href,
        method: "GET",
        headers,
      };
    }
    case "vread-request": {
      return {
        url: new URL(
          `${request.resource}/${request.id}/_history/${request.versionId}`,
          FHIRUrl,
        ).href,
        method: "GET",
        headers,
      };
    }
    case "delete-request": {
      switch (request.level) {
        case "instance": {
          return {
            url: new URL(`${request.resource}/${request.id}`, FHIRUrl).href,
            method: "DELETE",
            headers,
          };
        }
        case "type": {
          const queryString = parametersToQueryString(request.parameters);
          return {
            url: new URL(
              `${request.resource}${queryString ? `?${queryString}` : ""}`,
              FHIRUrl,
            ).href,
            method: "DELETE",
            headers,
          };
        }
        case "system": {
          const queryString = parametersToQueryString(request.parameters);
          return {
            url: new URL(`${queryString ? `?${queryString}` : ""}`, FHIRUrl)
              .href,
            method: "DELETE",
            headers,
          };
        }
      }
      throw new OperationError(outcomeError("exception", "Invalid level"));
    }
    case "history-request": {
      let historyUrl;
      const queryString = parametersToQueryString(request.parameters || []);
      switch (request.level) {
        case "instance": {
          historyUrl = new URL(
            `${request.resource}/${request.id}/_history`,
            FHIRUrl,
          ).href;
          break;
        }
        case "type": {
          historyUrl = new URL(`${request.resource}/_history`, FHIRUrl).href;
          break;
        }
        case "system": {
          historyUrl = new URL(`_history`, FHIRUrl).href;
          break;
        }
      }

      return {
        url: new URL(`${queryString ? `?${queryString}` : ""}`, historyUrl)
          .href,
        method: "GET",
        headers,
      };
    }

    case "batch-request":
    case "transaction-request": {
      return {
        url: FHIRUrl,
        method: "POST",
        body: JSON.stringify(request.body),
        headers,
      };
    }
    case "search-request": {
      const queryString = parametersToQueryString(request.parameters);
      let searchURL;
      switch (request.level) {
        case "type":
          searchURL = new URL(
            `${request.resource}${queryString ? `?${queryString}` : ""}`,
            FHIRUrl,
          ).href;
          break;
        case "system":
          searchURL = new URL(
            `${queryString ? `?${queryString}` : ""}`,
            FHIRUrl,
          ).href;
          break;
      }

      return {
        url: searchURL,
        method: "GET",
        headers,
      };
    }

    case "invoke-request": {
      let invokeURL;
      switch (request.level) {
        case "instance":
          invokeURL = new URL(
            `${request.resource}/${request.id}/$${request.operation}`,
            FHIRUrl,
          ).href;
          break;
        case "type":
          invokeURL = new URL(
            `${request.resource}/$${request.operation}`,
            FHIRUrl,
          ).href;
          break;
        case "system":
          invokeURL = new URL(`$${request.operation}`, FHIRUrl).href;
          break;
      }
      return {
        url: invokeURL,
        method: "POST",
        body: JSON.stringify(request.body),
        headers,
      };
    }
  }
}

export class ResponseError extends Error {
  private readonly _request: FHIRRequest;
  private readonly _response: R4FHIRErrorResponse | R4BFHIRErrorResponse;
  constructor(
    request: FHIRRequest,
    response: R4FHIRErrorResponse | R4BFHIRErrorResponse,
  ) {
    super();
    this._request = request;
    this._response = response;
  }
  get response() {
    return this._response;
  }
  get request() {
    return this._request;
  }
}

export function isResponseError(e: unknown): e is ResponseError {
  return e instanceof ResponseError;
}

async function httpResponseToFHIRResponse(
  request: FHIRRequest,
  response: Response,
): Promise<FHIRResponse> {
  if (response.status >= 400) {
    switch (response.status) {
      case 401: {
        throw new ResponseError(request, {
          fhirVersion: request.fhirVersion,
          level: request.level,
          type: "error-response",
          body: outcomeError("login", "Unauthorized") as any,
          http: {
            status: response.status,
            headers: Object.fromEntries(response.headers),
          },
        });
      }
      case 403: {
        throw new ResponseError(request, {
          fhirVersion: request.fhirVersion,
          level: request.level,
          type: "error-response",
          body: outcomeError("forbidden", "Forbidden") as any,
          http: {
            status: response.status,
            headers: Object.fromEntries(response.headers),
          },
        });
      }
      default: {
        if (!response.body) throw new Error(response.statusText);
        const oo = await response.json();

        if (!("resourceType" in oo) || oo.resourceType !== "OperationOutcome") {
          throw new Error(response.statusText);
        }

        throw new ResponseError(request, {
          fhirVersion: request.fhirVersion,
          level: request.level,
          type: "error-response",
          body: oo,
          http: {
            status: response.status,
            headers: Object.fromEntries(response.headers),
          },
        });
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
            resource: request.resource,
            body: parameters,
          } as FHIRResponse;
        }
        case "instance": {
          return {
            fhirVersion: request.fhirVersion,
            type: "invoke-response",
            operation: request.operation,
            level: "instance",
            resource: request.resource,
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
        resource: request.resource,
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
        resource: request.resource,
        id: request.id,
        versionId: request.versionId,
        body: vresource,
      } as FHIRResponse;
    }
    case "update-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const uresource = await response.json();

      switch (request.level) {
        case "instance": {
          return {
            fhirVersion: request.fhirVersion,
            type: "update-response",
            level: "instance",
            resource: request.resource,
            id: request.id,
            body: uresource,
          } as FHIRResponse;
        }
        case "type": {
          const location = response.headers.get("Location") ?? "";
          const parts = location.split("/");
          return {
            fhirVersion: request.fhirVersion,
            type: "update-response",
            level: "instance",
            resource: request.resource,
            id: parts[parts.length - 1] as id,
            body: uresource,
          } as FHIRResponse;
        }
        default: {
          throw new OperationError(outcomeError("exception", "Invalid level"));
        }
      }
    }
    case "patch-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const presource = await response.json();
      return {
        fhirVersion: request.fhirVersion,
        type: "patch-response",
        level: "instance",
        resource: request.resource,
        id: request.id,
        body: presource,
      } as FHIRResponse;
    }

    case "delete-request": {
      switch (request.level) {
        case "instance": {
          return {
            fhirVersion: request.fhirVersion,
            type: "delete-response",
            level: "instance",
            resource: request.resource,
            id: request.id,
          } as FHIRResponse;
        }
        case "type": {
          return {
            fhirVersion: request.fhirVersion,
            type: "delete-response",
            level: "type",
            resource: request.resource,
            parameters: request.parameters,
          } as FHIRResponse;
        }
        case "system": {
          return {
            fhirVersion: request.fhirVersion,
            type: "delete-response",
            level: "system",
            parameters: request.parameters,
          } as FHIRResponse;
        }
      }
      throw new OperationError(outcomeError("exception", "Invalid level"));
    }

    case "history-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));

      const bundle = (await response.json()) as Bundle | r4b.Bundle;
      switch (request.level) {
        case "system": {
          return {
            fhirVersion: request.fhirVersion,
            type: "history-response",
            level: "system",
            body: bundle,
          } as FHIRResponse;
        }
        case "type": {
          return {
            fhirVersion: request.fhirVersion,
            type: "history-response",
            level: "type",
            resource: request.resource,
            body: bundle,
          } as FHIRResponse;
        }
        case "instance": {
          return {
            fhirVersion: request.fhirVersion,
            type: "history-response",
            level: "instance",
            resource: request.resource,
            id: request.id,
            body: bundle,
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
        resource: request.resource,
        body: resource,
      } as FHIRResponse;
    }

    case "search-request": {
      if (!response.body)
        throw new OperationError(outcomeError("exception", "No response body"));
      const bundle = (await response.json()) as Bundle | r4b.Bundle;
      switch (request.level) {
        case "system": {
          return {
            fhirVersion: request.fhirVersion,
            type: "search-response",
            level: "system",
            parameters: request.parameters,
            body: bundle,
          } as FHIRResponse;
        }
        case "type": {
          return {
            fhirVersion: request.fhirVersion,
            type: "search-response",
            level: "type",
            parameters: request.parameters,
            resource: request.resource,
            body: bundle,
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

function httpMiddleware(): MiddlewareAsync<HTTPClientState, HTTPContext> {
  return createMiddlewareAsync<HTTPClientState, HTTPContext>([
    async (context) => {
      try {
        const httpRequest = await toHTTPRequest(
          context.state,
          context.ctx,
          context.request,
        );
        const response = await fetch(httpRequest.url, {
          method: httpRequest.method,
          headers: httpRequest.headers,
          body: httpRequest.body,
        });
        const fhirResponse = await httpResponseToFHIRResponse(
          context.request,
          response,
        );
        fhirResponse.http = {
          status: response.status,
          headers: Object.fromEntries(response.headers),
        };
        return {
          ...context,
          response: fhirResponse,
        };
      } catch (e) {
        if (isResponseError(e)) {
          if (e.response.body.issue[0].code === "login") {
            if (context.state.authenticate) {
              context.state.authenticate();
            }
          }
        }
        throw e;
      }
    },
  ]);
}

export default function createHTTPClient(
  initialState: HTTPClientState,
): AsynchronousClient<HTTPClientState, HTTPContext> {
  // Removing trailing slash
  const middleware = httpMiddleware();
  return new AsynchronousClient<HTTPClientState, HTTPContext>(
    initialState,
    middleware,
  );
}
