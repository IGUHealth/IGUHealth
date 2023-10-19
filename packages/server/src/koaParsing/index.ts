import Koa from "koa";

import { Bundle, Parameters, Resource } from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import parseParameters from "@iguhealth/client/url";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/types";

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

export function KoaRequestToFHIRRequest(
  url: string,
  request: { method: string; body?: unknown }
): FHIRRequest {
  const method = request.method;
  const urlPieces = url.split("?")[0].split("/");

  if (urlPieces.length === 1) {
    if (urlPieces[0] === "") {
      if (method === "POST") {
        if (!isBundle(request.body)) {
          throw new OperationError(
            outcomeError("invalid", "POST request must be a bundle")
          );
        }
        if (
          request.body.type !== "transaction" &&
          request.body.type !== "batch"
        ) {
          throw new OperationError(
            outcomeError(
              "invalid",
              "POST request must be a transaction or batch"
            )
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
      } else if (method === "GET") {
        return {
          type: "search-request",
          level: "system",
          parameters: parseParameters(url),
        };
      } else
        throw new OperationError(outcomeError("invalid", "request is invalid"));
    } else {
      if (urlPieces[0].startsWith("$")) {
        if (method === "POST") {
          return {
            type: "invoke-request",
            level: "system",
            operation: urlPieces[0].slice(1),
            body: request.body as Parameters,
          };
        } else if (method === "GET") {
          throw new OperationError(
            outcomeError(
              "not-supported",
              "Operation GET requests not yet supported"
            )
          );
        }
        throw new OperationError(
          outcomeError("invalid", `Invalid method for invocation '${method}'`)
        );
      }
      if (method === "POST") {
        if (resourceTypes.has(urlPieces[0])) {
          return {
            type: "create-request",
            level: "type",
            resourceType: urlPieces[0],
            body: request.body as Parameters,
          };
        } else if (urlPieces[0] === "_search") {
          throw new OperationError(
            outcomeError("not-supported", "Search via post not supported.")
          );
        }
      } else if (method === "GET") {
        if (urlPieces[0] === "metadata")
          return {
            type: "capabilities-request",
            level: "system",
          };
        if (urlPieces[0] === "_history") {
          return {
            type: "history-request",
            level: "system",
            parameters: parseParameters(url),
          };
        }
        // Split by Questionmark because of search parameters
        if (resourceTypes.has(urlPieces[0].split("?")[0])) {
          return {
            type: "search-request",
            level: "type",
            resourceType: urlPieces[0].split("?")[0],
            parameters: parseParameters(url),
          };
        }
      }
    }
  } else if (urlPieces.length === 2) {
    if (urlPieces[1].startsWith("$")) {
      if (method === "POST") {
        return {
          type: "invoke-request",
          level: "type",
          resourceType: urlPieces[0],
          operation: urlPieces[1].slice(1),
          body: request.body as Parameters,
        };
      } else if (method === "GET") {
        throw new OperationError(
          outcomeError(
            "not-supported",
            "Operation GET requests not yet supported"
          )
        );
      }
      throw new OperationError(
        outcomeError("invalid", `Invalid method for invocation '${method}'`)
      );
    } else if (method === "POST") {
      if (urlPieces[1] === "_search") {
        throw new OperationError(
          outcomeError("not-supported", "Search via post not supported.")
        );
      }
    } else if (method === "GET") {
      if (urlPieces[1] === "_history") {
        return {
          type: "history-request",
          level: "type",
          resourceType: urlPieces[0],
          parameters: parseParameters(url),
        };
      } else if (resourceTypes.has(urlPieces[0])) {
        return {
          type: "read-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1],
        };
      }
    } else if (method === "PUT") {
      if (resourceTypes.has(urlPieces[0])) {
        return {
          type: "update-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1],
          body: request.body as Resource,
        };
      }
    } else if (method === "PATCH") {
      if (resourceTypes.has(urlPieces[0])) {
        return {
          type: "patch-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1],
          body: request.body as object,
        };
      }
    } else if (method === "DELETE") {
      if (resourceTypes.has(urlPieces[0])) {
        return {
          type: "delete-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1],
        };
      }
    }
  } else if (urlPieces.length === 3) {
    if (urlPieces[2].startsWith("$")) {
      if (method === "POST") {
        return {
          type: "invoke-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1],
          operation: urlPieces[2].slice(1),
          body: request.body as Parameters,
        };
      } else if (method === "GET") {
        throw new OperationError(
          outcomeError(
            "not-supported",
            "Operation GET requests not yet supported"
          )
        );
      }
      throw new OperationError(
        outcomeError("invalid", `Invalid method for invocation '${method}'`)
      );
    } else if (method === "GET") {
      if (resourceTypes.has(urlPieces[0]) && urlPieces[2] === "_history") {
        return {
          type: "history-request",
          level: "instance",
          resourceType: urlPieces[0],
          id: urlPieces[1],
          parameters: parseParameters(url),
        };
      }
    }
  } else if (urlPieces.length === 4) {
    if (resourceTypes.has(urlPieces[1]) && urlPieces[2] === "_history") {
      return {
        type: "vread-request",
        level: "instance",
        resourceType: urlPieces[0],
        id: urlPieces[1],
        versionId: urlPieces[3],
      };
    }
  }
  throw new OperationError(outcomeError("invalid", "request is invalid"));
}

function toBundle(
  bundleType: Bundle["type"],
  total: number | undefined,
  resources: Resource[]
): Bundle {
  return {
    resourceType: "Bundle",
    type: bundleType,
    total: total,
    entry: resources.map((resource) => ({ resource })),
  };
}

export function fhirResponseToKoaResponse(
  fhirResponse: FHIRResponse
): Partial<Koa.Response> {
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
    case "capabilities-response":
      return {
        status: 200,
        body: fhirResponse.body,
      };
    case "batch-response":
      return {
        status: 200,
        body: fhirResponse.body,
      };
    case "transaction-response":
      return {
        status: 200,
        body: fhirResponse.body,
      };
    case "invoke-response":
      return { body: fhirResponse.body, status: 200 };
  }
}
