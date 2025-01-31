import * as dateTzs from "@date-fns/tz";
import * as dateFns from "date-fns";

import { FHIRRequest, FHIRResponse } from "@iguhealth/client/types";
import parseUrl from "@iguhealth/client/url";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import * as r4 from "@iguhealth/fhir-types/r4/types";
import { resourceTypes as r4bResourceTypes } from "@iguhealth/fhir-types/r4b/sets";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

/*
 ** For Summary of types see:
 ** https://build.fhir.org/http.html#summary
 **
 -----------------------------------------------------------------------------------------------------------------
search-compartment	/[compartment]/[id]/*?	            GET	N/A	N/A	N/A	N/A
                    /[compartment]/[id]/[type]?	        GET	N/A	N/A	N/A	N/A
                    /[compartment]/[id]/_search?	      POST	application/x-www-form-urlencoded	form data	N/A	N/A
                    /[compartment]/[id]/[type]/_search?	POST	application/x-www-form-urlencoded	form data	N/A	N/A
transaction	        /	                                  POST	R	Bundle	O	N/A
batch	              /	                                  POST	R	Bundle	O	N/A
search-system	      ?	                                  GET	N/A	N/A	N/A	N/A

capabilities	      /metadata	                          GET‡	N/A	N/A	N/A	N/A
create         	    /[type]                           	POST	R	Resource	O	O: If-None-Exist
search-type	        /[type]?                           	GET	N/A	N/A	N/A	N/A
search-system       /_search	                          POST	application/x-www-form-urlencoded	form data	N/A	N/A
history-system	    /_history	                          GET	N/A	N/A	N/A	N/A
(operation)	        /$[name]                            POST	R	Parameters	N/A	N/A 
                                                        GET	N/A	N/A	N/A	N/A
                                                        POST	application/x-www-form-urlencoded	form data	N/A	N/A
(operation)	        /[type]/$[name]                     POST	R	Parameters	N/A	N/A 
                                                        GET	N/A	N/A	N/A	N/A
                                                        POST	application/x-www-form-urlencoded	form data	N/A	N/A
search-type         /[type]/_search?	                  POST	application/x-www-form-urlencoded	form data	N/A	N/A
read            	  /[type]/[id]	                      GET‡	N/A	N/A	N/A	O: If-Modified-Since, If-None-Match
update             	/[type]/[id]                      	PUT	R	Resource	O	O: If-Match
update-conditional  /[type]?                            PUT	R	Resource	O	O: If-Match
patch        	      /[type]/[id]                      	PATCH	R (may be a patch type)	Patch	O	O: If-Match
delete	            /[type]/[id]	                      DELETE	N/A	N/A	N/A	N/A
delete-conditional  /[type]?                            DELETE	N/A	N/A	N/A	O: If-Match
                    /?	                                DELETE	N/A	N/A	N/A	O: If-Match
history-type	      /[type]/_history	                  GET	N/A	N/A	N/A	N/A

(operation)         /[type]/[id]/$[name]                POST	R	Parameters	N/A	N/A 
                                                        GET	N/A	N/A	N/A	N/A
                                                        POST	application/x-www-form-urlencoded	form data	N/A	N/A
history-instance	  /[type]/[id]/_history	              GET	N/A	N/A	N/A	N/A
vread            	  /[type]/[id]/_history/[vid]	        GET‡	N/A	N/A	N/A	N/A
 -----------------------------------------------------------------------------------------------------------------
*/

function isBundle<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  v: unknown,
): v is Resource<Version, "Bundle"> {
  if (
    typeof v === "object" &&
    v !== null &&
    Object.prototype.hasOwnProperty.call(v, "resourceType") &&
    (v as r4.Resource | r4b.Resource).resourceType === "Bundle"
  )
    return true;
  return false;
}

/**
 * Verifies that the resource type is valid for the given FHIR version.
 * @param fhirVersion The FHIR version.
 * @param r The resource type.
 * @returns True if the resource type is valid for the given FHIR version.
 */
function verifyResourceType<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  r: string,
): r is ResourceType<Version> {
  switch (fhirVersion) {
    case R4: {
      return resourceTypes.has(r);
    }
    case R4B: {
      return r4bResourceTypes.has(r);
    }
  }

  throw new OperationError(
    outcomeError("invalid", `Invalid FHIR version '${fhirVersion}'`),
  );
}

type HTTPRequest = {
  url: string;
  method: string;
  body?: unknown;
};

/* 
transaction	        /	                                  POST	R	Bundle	O	N/A
batch	              /	                                  POST	R	Bundle	O	N/A
search-system	      ?	                                  GET	N/A	N/A	N/A	N/A
delete-conditional  ?                                   DELETE N/A N/A N/A O: If-Match
*/
function parseRequest1Empty<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  urlPieces: string[],
  request: HTTPRequest,
): FHIRRequest<Version> {
  switch (request.method) {
    case "POST": {
      if (!isBundle(fhirVersion, request.body)) {
        throw new OperationError(
          outcomeError("invalid", "POST request must be a bundle"),
        );
      }
      if (
        request.body.type !== "transaction" &&
        request.body.type !== "batch"
      ) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "POST request must be a transaction or batch",
          ),
        );
      }
      return {
        fhirVersion,
        type:
          request.body.type === "transaction"
            ? "transaction-request"
            : "batch-request",
        level: "system",
        body: request.body as Resource<Version, "Bundle">,
      };
    }
    case "GET": {
      return {
        fhirVersion,
        type: "search-request",
        level: "system",
        parameters: parseUrl(request.url),
      };
    }
    case "DELETE": {
      return {
        fhirVersion,
        type: "delete-request",
        level: "system",
        parameters: parseUrl(request.url),
      };
    }
    default: {
      throw new OperationError(
        outcomeError("invalid", "Request could not be parsed at type level."),
      );
    }
  }
}

/* 
search-system	      ?	                                  GET	N/A	N/A	N/A	N/A

capabilities	      /metadata	                          GET‡	N/A	N/A	N/A	N/A
create         	    /[type]                           	POST	R	Resource	O	O: If-None-Exist
search-type	        /[type]?                           	GET	N/A	N/A	N/A	N/A
search-system       /_search	                          POST	application/x-www-form-urlencoded	form data	N/A	N/A
delete-conditional	/[type]?	                          DELETE	N/A	N/A	N/A	O: If-Match
update-conditional  /[type]?                            PUT	R	Resource	O	O: If-Match
history-system	    /_history	                          GET	N/A	N/A	N/A	N/A
(operation)	        /$[name]                            POST	R	Parameters	N/A	N/A 
                                                        GET	N/A	N/A	N/A	N/A
                                                        POST	application/x-www-form-urlencoded	form data	N/A	N/A
*/
function parseRequest1NonEmpty<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  urlPieces: string[],
  request: HTTPRequest,
): FHIRRequest<Version> {
  switch (true) {
    case urlPieces[0].startsWith("$"): {
      switch (request.method) {
        case "POST": {
          return {
            fhirVersion,
            type: "invoke-request",
            level: "system",
            operation: urlPieces[0].slice(1) as r4.code,
            body: request.body as Resource<Version, "Parameters">,
          };
        }
        case "GET": {
          throw new OperationError(
            outcomeError(
              "not-supported",
              "Operation GET requests not yet supported",
            ),
          );
        }
      }
      throw new OperationError(
        outcomeError(
          "invalid",
          `Invalid method for invocation '${request.method}'`,
        ),
      );
    }
    case request.method === "POST": {
      if (urlPieces[0] === "_search") {
        throw new OperationError(
          outcomeError("not-supported", "Search via post not supported."),
        );
      }
      if (verifyResourceType(fhirVersion, urlPieces[0])) {
        const resourceType = urlPieces[0] as ResourceType<Version>;
        return {
          fhirVersion,
          type: "create-request",
          level: "type",
          resource: resourceType,
          body: request.body as Resource<Version, typeof resourceType>,
        };
      }
      throw new OperationError(
        outcomeError("invalid", `Invalid resource type ${urlPieces[0]}`),
      );
    }
    case request.method === "PUT": {
      const resourceType = urlPieces[0].split("?")[0];
      if (verifyResourceType(fhirVersion, resourceType)) {
        return {
          fhirVersion,
          type: "update-request",
          level: "type",
          resource: resourceType,
          body: request.body as Resource<Version, typeof resourceType>,
          parameters: parseUrl(request.url),
        };
      } else {
        throw new OperationError(
          outcomeError("invalid", "Invalid resource type"),
        );
      }
    }
    case request.method === "DELETE": {
      const resourceType = urlPieces[0].split("?")[0];
      if (verifyResourceType(fhirVersion, resourceType)) {
        return {
          fhirVersion,
          type: "delete-request",
          level: "type",
          resource: resourceType,
          parameters: parseUrl(request.url),
        };
      } else {
        throw new OperationError(
          outcomeError("invalid", "Invalid resource type"),
        );
      }
    }
    case request.method === "GET": {
      switch (true) {
        case urlPieces[0] === "metadata": {
          return {
            fhirVersion,
            type: "capabilities-request",
            level: "system",
          };
        }
        case urlPieces[0] === "_history": {
          return {
            fhirVersion,
            type: "history-request",
            level: "system",
            parameters: parseUrl(request.url),
          };
        }
        default: {
          // Split by Questionmark because of search parameters
          const resourceType = urlPieces[0].split("?")[0];
          if (verifyResourceType(fhirVersion, resourceType)) {
            return {
              fhirVersion,
              type: "search-request",
              level: "type",
              resource: resourceType,
              parameters: parseUrl(request.url),
            };
          } else {
            throw new OperationError(
              outcomeError("invalid", "Invalid resource type for search."),
            );
          }
        }
      }
    }
  }
  throw new OperationError(
    outcomeError("invalid", "Request could not be parsed."),
  );
}

// Parses the request for urls split at length 1 (includes system searches, creations, and operation invocations)
function parseRequest1<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  urlPieces: string[],
  request: HTTPRequest,
): FHIRRequest<Version> {
  if (urlPieces[0] === "") {
    return parseRequest1Empty(fhirVersion, urlPieces, request);
  } else {
    return parseRequest1NonEmpty(fhirVersion, urlPieces, request);
  }
}

/*
(operation)	        /[type]/$[name]                     POST	R	Parameters	N/A	N/A 
                                                        GET	N/A	N/A	N/A	N/A
                                                        POST	application/x-www-form-urlencoded	form data	N/A	N/A
search-type         /[type]/_search?	                  POST	application/x-www-form-urlencoded	form data	N/A	N/A
read            	  /[type]/[id]	                      GET‡	N/A	N/A	N/A	O: If-Modified-Since, If-None-Match
update             	/[type]/[id]                      	PUT	R	Resource	O	O: If-Match
patch        	      /[type]/[id]                      	PATCH	R (may be a patch type)	Patch	O	O: If-Match
delete	            /[type]/[id]	                      DELETE	N/A	N/A	N/A	N/A
history-type	      /[type]/_history	                  GET	N/A	N/A	N/A	N/A
*/
function parseRequest2<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  urlPieces: string[],
  request: HTTPRequest,
): FHIRRequest<Version> {
  const resourceType = urlPieces[0];
  if (verifyResourceType(fhirVersion, resourceType)) {
    switch (true) {
      case urlPieces[1].startsWith("$"): {
        switch (request.method) {
          case "POST": {
            return {
              fhirVersion,
              type: "invoke-request",
              level: "type",
              resource: resourceType,
              operation: urlPieces[1].slice(1) as r4.code,
              body: request.body as Resource<Version, "Parameters">,
            };
          }
          case "GET": {
            throw new OperationError(
              outcomeError(
                "not-supported",
                "Operation GET requests not yet supported",
              ),
            );
          }
          default: {
            throw new OperationError(
              outcomeError(
                "invalid",
                `Invalid method for invocation '${request.method}'`,
              ),
            );
          }
        }
      }
      case request.method === "POST": {
        if (urlPieces[1] === "_search") {
          throw new OperationError(
            outcomeError("not-supported", "Search via post not supported."),
          );
        } else {
          throw new OperationError(
            outcomeError(
              "invalid",
              "To create new resources run post at resource root.",
            ),
          );
        }
      }
      case request.method === "GET": {
        switch (true) {
          case urlPieces[1] === "_history": {
            return {
              fhirVersion,
              type: "history-request",
              level: "type",
              resource: resourceType,
              parameters: parseUrl(request.url),
            };
          }
          default: {
            return {
              fhirVersion,
              type: "read-request",
              level: "instance",
              resource: resourceType,
              id: urlPieces[1] as r4b.id,
            };
          }
        }
      }
      case request.method === "PUT": {
        return {
          fhirVersion,
          type: "update-request",
          level: "instance",
          resource: resourceType,
          id: urlPieces[1] as r4.id,
          body: request.body as Resource<Version, typeof resourceType>,
        };
      }
      case request.method === "PATCH": {
        return {
          fhirVersion,
          type: "patch-request",
          level: "instance",
          resource: resourceType,
          id: urlPieces[1] as r4.id,
          body: request.body as object,
        };
      }
      case request.method === "DELETE": {
        return {
          fhirVersion,
          type: "delete-request",
          level: "instance",
          resource: resourceType,
          id: urlPieces[1] as r4.id,
        };
      }
    }
  }

  throw new OperationError(
    outcomeError("invalid", "Request could not be parsed at type level."),
  );
}

/*
(operation)         /[type]/[id]/$[name]                POST	R	Parameters	N/A	N/A 
                                                        GET	N/A	N/A	N/A	N/A
                                                        POST	application/x-www-form-urlencoded	form data	N/A	N/A
history-instance	  /[type]/[id]/_history	              GET	N/A	N/A	N/A	N/A
*/
function parseRequest3<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  urlPieces: string[],
  request: HTTPRequest,
): FHIRRequest<Version> {
  if (verifyResourceType(fhirVersion, urlPieces[0])) {
    switch (true) {
      case urlPieces[2].startsWith("$"): {
        switch (request.method) {
          case "POST": {
            return {
              fhirVersion,
              type: "invoke-request",
              level: "instance",
              resource: urlPieces[0],
              id: urlPieces[1] as r4.id,
              operation: urlPieces[2].slice(1) as r4.code,
              body: request.body as Resource<Version, "Parameters">,
            };
          }
          case "GET": {
            throw new OperationError(
              outcomeError(
                "not-supported",
                "Operation GET requests not yet supported",
              ),
            );
          }
          default: {
            throw new OperationError(
              outcomeError(
                "invalid",
                `Invalid method for invocation '${request.method}'`,
              ),
            );
          }
        }
      }
      case request.method === "GET": {
        if (urlPieces[2] === "_history") {
          return {
            fhirVersion,
            type: "history-request",
            level: "instance",
            resource: urlPieces[0],
            id: urlPieces[1] as r4.id,
            parameters: parseUrl(request.url),
          };
        }
      }
    }
  }
  throw new OperationError(
    outcomeError("invalid", "Request could not be parsed at type level."),
  );
}

/*
vread            	  /[type]/[id]/_history/[vid]	        GET‡	N/A	N/A	N/A	N/A
*/
function parseRequest4<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  urlPieces: string[],
  _request: HTTPRequest,
): FHIRRequest<Version> {
  if (
    verifyResourceType(fhirVersion, urlPieces[0]) &&
    urlPieces[2] === "_history"
  ) {
    return {
      fhirVersion,
      type: "vread-request",
      level: "instance",
      resource: urlPieces[0],
      id: urlPieces[1] as r4.id,
      versionId: urlPieces[3],
    };
  }
  throw new OperationError(
    outcomeError("invalid", "Request could not be parsed at version level."),
  );
}

export function deriveFHIRVersion(fhirVersion: string): FHIR_VERSION {
  switch (true) {
    case fhirVersion === R4 || fhirVersion === "r4":
      return R4;
    case fhirVersion === R4B || fhirVersion === "r4b":
      return R4B;
    default:
      throw new OperationError(
        outcomeError("invalid", `Invalid FHIR version '${fhirVersion}'`),
      );
  }
}

export function httpRequestToFHIRRequest(
  fhirVersionUrlChunk: string,
  request: HTTPRequest,
): FHIRRequest<FHIR_VERSION> {
  const urlPieces = request.url.split("?")[0].split("/");
  const fhirVersion = deriveFHIRVersion(fhirVersionUrlChunk);

  switch (urlPieces.length) {
    case 1:
      return parseRequest1(fhirVersion, urlPieces, request);
    case 2:
      return parseRequest2(fhirVersion, urlPieces, request);
    case 3:
      return parseRequest3(fhirVersion, urlPieces, request);
    case 4:
      return parseRequest4(fhirVersion, urlPieces, request);
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          "Request is malformed and must be conformant with FHIR Standard.",
        ),
      );
  }
}

export type HTTPResponse = {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
};

function lastModified(instant: r4.instant | undefined): string | undefined {
  if (!instant) return undefined;
  const date = dateFns.parse(
    instant,
    "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
    new dateTzs.TZDate(),
  );
  const offset = dateTzs.tzOffset("GMT", date);
  const gmtDate = dateFns.addMinutes(date, offset);

  return dateFns.format(gmtDate, "EEE, dd MMM yyyy HH:mm:ss 'GMT'");
}

export function fhirResponseToHTTPResponse(
  fhirResponse: FHIRResponse<FHIR_VERSION>,
): HTTPResponse {
  // https://github.com/koajs/koa/blob/master/docs/api/response.md#object
  // Will default to application/json unless specified.
  const headers: Record<string, string> = {
    "Content-Type": "application/fhir+json; charset=utf-8",
  };
  switch (fhirResponse.type) {
    case "read-response":
    case "vread-response":
      return {
        headers: {
          ...headers,
          "Content-Location": `${fhirResponse.body.resourceType}/${
            fhirResponse.body.id
          }${
            fhirResponse.type === "vread-response"
              ? `/${fhirResponse.versionId}`
              : ""
          }`,
          ETag: `W/"${fhirResponse.body.meta?.versionId}"`,
          "Last-Modified":
            lastModified(fhirResponse.body.meta?.lastUpdated) ?? "",
        },
        body: fhirResponse.body,
        status: 200,
      };
    case "update-response":
    case "patch-response":
      return {
        headers: {
          ...headers,
          Location: `${fhirResponse.body.resourceType}/${fhirResponse.body.id}`,
          ETag: `W/"${fhirResponse.body.meta?.versionId}"`,
          "Last-Modified":
            lastModified(fhirResponse.body.meta?.lastUpdated) ?? "",
        },
        body: fhirResponse.body,
        status:
          "created" in fhirResponse && fhirResponse.created === true
            ? 201
            : 200,
      };
    case "delete-response":
      return {
        headers: {
          ...headers,
        },
        status: 200,
      };
    case "history-response":
      return {
        headers: {
          ...headers,
        },
        status: 200,
        body: fhirResponse.body,
      };
    case "create-response":
      return {
        headers: {
          ...headers,
          Location: `${fhirResponse.body.resourceType}/${fhirResponse.body.id}`,
          ETag: `W/"${fhirResponse.body.meta?.versionId}"`,
          "Last-Modified":
            lastModified(fhirResponse.body.meta?.lastUpdated) ?? "",
        },
        body: fhirResponse.body,
        status: 201,
      };
    case "search-response": {
      return {
        headers: {
          ...headers,
        },
        status: 200,
        body: fhirResponse.body,
      };
    }
    case "transaction-response":
    case "capabilities-response":
    case "batch-response":
    case "invoke-response":
      return {
        headers: {
          ...headers,
        },
        status: 200,
        body: fhirResponse.body,
      };
  }

  throw new OperationError(
    outcomeError("invalid", "Response could not be parsed."),
  );
}
