import Koa from "koa";

import { Bundle, Resource } from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import parseQuery from "./url.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRRequest } from "../client/types";
import parseParameters from "./url.js";
import { Operation } from "@iguhealth/operation-execution";

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
    v.hasOwnProperty("resourceType") &&
    (v as any).resourceType === "Bundle"
  )
    return true;
  return false;
}

export function KoaRequestToFHIRRequest(
  url: string,
  request: Koa.Request
): FHIRRequest {
  const fhirQuery = parseQuery(url);

  const method = request.method;
  const urlPieces = url.split("/");
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
      if (method === "GET") {
        if (urlPieces[0] === "metadata")
          return {
            type: "capabilities-request",
            level: "system",
          };
        if (urlPieces[0] === "_history") {
          return {
            type: "history-request",
            level: "system",
          };
        }
        if (urlPieces[0].startsWith("$")) {
          throw new OperationError(
            outcomeError(
              "not-supported",
              "Operation get requests not yet supported"
            )
          );
        }
        if (resourceTypes.has(urlPieces[0])) {
          return {
            type: "search-request",
            level: "type",
            resourceType: urlPieces[0],
            parameters: parseParameters(url),
          };
        }
      }
    }
  } else if (urlPieces.length === 2) {
  } else if (urlPieces.length === 3) {
  } else if (urlPieces.length === 4) {
  }
  throw new OperationError(outcomeError("invalid", "request is invalid"));
}
