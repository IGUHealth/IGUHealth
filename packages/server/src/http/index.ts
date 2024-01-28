import { FHIRRequest, FHIRResponse } from "@iguhealth/client/types";
import parseUrl from "@iguhealth/client/url";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  Bundle,
  Parameters,
  Resource,
  ResourceType,
  code,
  id,
  unsignedInt,
} from "@iguhealth/fhir-types/r4/types";
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
patch        	      /[type]/[id]                      	PATCH	R (may be a patch type)	Patch	O	O: If-Match
delete	            /[type]/[id]	                      DELETE	N/A	N/A	N/A	N/A
history-type	      /[type]/_history	                  GET	N/A	N/A	N/A	N/A

(operation)         /[type]/[id]/$[name]                POST	R	Parameters	N/A	N/A 
                                                        GET	N/A	N/A	N/A	N/A
                                                        POST	application/x-www-form-urlencoded	form data	N/A	N/A
history-instance	  /[type]/[id]/_history	              GET	N/A	N/A	N/A	N/A

vread            	  /[type]/[id]/_history/[vid]	        GET‡	N/A	N/A	N/A	N/A
 -----------------------------------------------------------------------------------------------------------------
*/

function isBundle(v: unknown): v is Bundle {
  if (
    typeof v === "object" &&
    v !== null &&
    Object.prototype.hasOwnProperty.call(v, "resourceType") &&
    (v as Resource).resourceType === "Bundle"
  )
    return true;
  return false;
}

function verifyResourceType(r: string): r is ResourceType {
  if (!resourceTypes.has(r))
    throw new OperationError(
      outcomeError("invalid", `Invalid resource type '${r}'`),
    );
  return true;
}

type HTTPRequest = {
  url: string;
  method: string;
  body?: unknown;
};

/* 
transaction	        /	                                  POST	R	Bundle	O	N/A
batch	              /	                                  POST	R	Bundle	O	N/A
*/
function parseRequest1Empty(
  urlPieces: string[],
  request: HTTPRequest,
): FHIRRequest {
  if (request.method === "POST") {
    if (!isBundle(request.body)) {
      throw new OperationError(
        outcomeError("invalid", "POST request must be a bundle"),
      );
    }
    if (request.body.type !== "transaction" && request.body.type !== "batch") {
      throw new OperationError(
        outcomeError("invalid", "POST request must be a transaction or batch"),
      );
    }
    return {
      type:
        request.body.type === "transaction"
          ? "transaction-request"
          : "batch-request",
      level: "system",
      body: request.body,
    };
  } else if (request.method === "GET") {
    return {
      type: "search-request",
      level: "system",
      parameters: parseUrl(request.url),
    };
  } else
    throw new OperationError(
      outcomeError("invalid", "Request could not be parsed at type level."),
    );
}

/* 
search-system	      ?	                                  GET	N/A	N/A	N/A	N/A

capabilities	      /metadata	                          GET‡	N/A	N/A	N/A	N/A
create         	    /[type]                           	POST	R	Resource	O	O: If-None-Exist
search-type	        /[type]?                           	GET	N/A	N/A	N/A	N/A
search-system       /_search	                          POST	application/x-www-form-urlencoded	form data	N/A	N/A
history-system	    /_history	                          GET	N/A	N/A	N/A	N/A
(operation)	        /$[name]                            POST	R	Parameters	N/A	N/A 
                                                        GET	N/A	N/A	N/A	N/A
                                                        POST	application/x-www-form-urlencoded	form data	N/A	N/A
*/
function parseRequest1NonEmpty(
  urlPieces: string[],
  request: HTTPRequest,
): FHIRRequest {
  if (urlPieces[0].startsWith("$")) {
    if (request.method === "POST") {
      return {
        type: "invoke-request",
        level: "system",
        operation: urlPieces[0].slice(1) as code,
        body: request.body as Parameters,
      };
    } else if (request.method === "GET") {
      throw new OperationError(
        outcomeError(
          "not-supported",
          "Operation GET requests not yet supported",
        ),
      );
    }
    throw new OperationError(
      outcomeError(
        "invalid",
        `Invalid method for invocation '${request.method}'`,
      ),
    );
  }
  if (request.method === "POST") {
    if (urlPieces[0] === "_search") {
      throw new OperationError(
        outcomeError("not-supported", "Search via post not supported."),
      );
    }
    if (verifyResourceType(urlPieces[0])) {
      return {
        type: "create-request",
        level: "type",
        resourceType: urlPieces[0],
        body: request.body as Parameters,
      };
    }
  } else if (request.method === "GET") {
    if (urlPieces[0] === "metadata")
      return {
        type: "capabilities-request",
        level: "system",
      };
    if (urlPieces[0] === "_history") {
      return {
        type: "history-request",
        level: "system",
        parameters: parseUrl(request.url),
      };
    }

    // Split by Questionmark because of search parameters
    const resourceType = urlPieces[0].split("?")[0];
    if (verifyResourceType(resourceType)) {
      return {
        type: "search-request",
        level: "type",
        resourceType,
        parameters: parseUrl(request.url),
      };
    }
  }
  throw new OperationError(
    outcomeError("invalid", "Request could not be parsed at system level."),
  );
}

// Parses the request for urls split at length 1 (includes system searches, creations, and operation invocations)
function parseRequest1(urlPieces: string[], request: HTTPRequest): FHIRRequest {
  if (urlPieces[0] === "") {
    return parseRequest1Empty(urlPieces, request);
  } else {
    return parseRequest1NonEmpty(urlPieces, request);
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
function parseRequest2(urlPieces: string[], request: HTTPRequest): FHIRRequest {
  if (verifyResourceType(urlPieces[0])) {
    if (urlPieces[1].startsWith("$")) {
      if (request.method === "POST") {
        return {
          type: "invoke-request",
          level: "type",
          resourceType: urlPieces[0],
          operation: urlPieces[1].slice(1) as code,
          body: request.body as Parameters,
        };
      } else if (request.method === "GET") {
        throw new OperationError(
          outcomeError(
            "not-supported",
            "Operation GET requests not yet supported",
          ),
        );
      }
      throw new OperationError(
        outcomeError(
          "invalid",
          `Invalid method for invocation '${request.method}'`,
        ),
      );
    } else if (request.method === "POST") {
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
    } else if (request.method === "GET") {
      if (urlPieces[1] === "_history") {
        return {
          type: "history-request",
          level: "type",
          resourceType: urlPieces[0],
          parameters: parseUrl(request.url),
        };
      } else if (resourceTypes.has(urlPieces[0])) {
        return {
          type: "read-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1] as id,
        };
      }
    } else if (request.method === "PUT") {
      return {
        type: "update-request",
        level: "instance",
        resourceType: urlPieces[0],
        id: urlPieces[1] as id,
        body: request.body as Resource,
      };
    } else if (request.method === "PATCH") {
      return {
        type: "patch-request",
        level: "instance",
        resourceType: urlPieces[0],
        id: urlPieces[1] as id,
        body: request.body as object,
      };
    } else if (request.method === "DELETE") {
      return {
        type: "delete-request",
        level: "instance",
        resourceType: urlPieces[0],
        id: urlPieces[1] as id,
      };
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
function parseRequest3(urlPieces: string[], request: HTTPRequest): FHIRRequest {
  if (verifyResourceType(urlPieces[0])) {
    if (urlPieces[2].startsWith("$")) {
      if (request.method === "POST") {
        return {
          type: "invoke-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1] as id,
          operation: urlPieces[2].slice(1) as code,
          body: request.body as Parameters,
        };
      } else if (request.method === "GET") {
        throw new OperationError(
          outcomeError(
            "not-supported",
            "Operation GET requests not yet supported",
          ),
        );
      }
      throw new OperationError(
        outcomeError(
          "invalid",
          `Invalid method for invocation '${request.method}'`,
        ),
      );
    } else if (request.method === "GET") {
      if (urlPieces[2] === "_history") {
        return {
          type: "history-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1] as id,
          parameters: parseUrl(request.url),
        };
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
function parseRequest4(
  urlPieces: string[],
  _request: HTTPRequest,
): FHIRRequest {
  if (verifyResourceType(urlPieces[0]) && urlPieces[2] === "_history") {
    return {
      type: "vread-request",
      level: "instance",
      resourceType: urlPieces[0],
      id: urlPieces[1] as id,
      versionId: urlPieces[3],
    };
  }
  throw new OperationError(
    outcomeError("invalid", "Request could not be parsed at version level."),
  );
}

export function httpRequestToFHIRRequest(request: HTTPRequest): FHIRRequest {
  const urlPieces = request.url.split("?")[0].split("/");
  switch (urlPieces.length) {
    case 1:
      return parseRequest1(urlPieces, request);
    case 2:
      return parseRequest2(urlPieces, request);
    case 3:
      return parseRequest3(urlPieces, request);
    case 4:
      return parseRequest4(urlPieces, request);
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          "Request is malformed and must be conformant with FHIR Standard.",
        ),
      );
  }
}

function toBundle(
  bundleType:
    | "document"
    | "message"
    | "transaction"
    | "transaction-response"
    | "batch"
    | "batch-response"
    | "history"
    | "searchset"
    | "collection",
  total: unsignedInt | undefined,
  resources: Resource[],
): Bundle {
  return {
    resourceType: "Bundle",
    type: bundleType as code,
    total: total,
    entry: resources.map((resource) => ({ resource })),
  };
}

type HTTPResponse = {
  status: number;
  body?: unknown;
  headers?: Record<string, string>;
};

export function fhirResponseToHTTPResponse(
  fhirResponse: FHIRResponse,
): HTTPResponse {
  switch (fhirResponse.type) {
    case "read-response":
    case "vread-response":
      return {
        headers: {
          "Content-Location": `${fhirResponse.body.resourceType}/${
            fhirResponse.body.id
          }${
            fhirResponse.type === "vread-response"
              ? `/${fhirResponse.versionId}`
              : ""
          }`,
        },
        body: fhirResponse.body,
        status: 200,
      };
    case "update-response":
    case "patch-response":
      return {
        headers: {
          Location: `${fhirResponse.body.resourceType}/${fhirResponse.body.id}`,
        },
        body: fhirResponse.body,
        status: 200,
      };
    case "delete-response":
      return {
        status: 200,
      };
    case "history-response":
      return {
        status: 200,
        body: {
          type: "history",
          resourceType: "Bundle",
          entry: fhirResponse.body,
        },
      };
    case "create-response":
      return {
        headers: {
          Location: `${fhirResponse.body.resourceType}/${fhirResponse.body.id}`,
        },
        body: fhirResponse.body,
        status: 201,
      };
    case "search-response": {
      return {
        status: 200,
        body: toBundle("searchset", fhirResponse.total, fhirResponse.body),
      };
    }
    case "transaction-response":
    case "capabilities-response":
    case "batch-response":
    case "invoke-response":
      return {
        status: 200,
        body: fhirResponse.body,
      };
  }
}
