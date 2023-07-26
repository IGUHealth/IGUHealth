import Koa from "koa";

import { Resource } from "@iguhealth/fhir-types/r4/types";
import parseQuery, { FHIRURL } from "./url.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import {
  FHIRRequest,
  RequestLevel,
  TypeInteraction,
  InstanceInteraction,
  SystemInteraction,
} from "../client/types";

function getInteractionLevel(
  fhirURL: FHIRURL
): RequestLevel[keyof RequestLevel] {
  if (fhirURL.resourceType && fhirURL.id) {
    return "instance";
  } else if (fhirURL.resourceType !== undefined) {
    return "type";
  }
  return "system";
}

function parseInstantRequest(
  request: Koa.Request,
  fhirURL: FHIRURL,
  fhirRequest: Pick<InstanceInteraction, "level" | "resourceType" | "id">
): FHIRRequest {
  switch (request.method) {
    case "GET":
      return {
        type: "read-request",
        ...fhirRequest,
      };
    case "PUT":
      return {
        type: "update-request",
        body: request.body as Resource,
        ...fhirRequest,
      };
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Instance interaction '${request.method}' not supported`
        )
      );
  }
}

function parseTypeRequest(
  request: Koa.Request,
  fhirURL: FHIRURL,
  fhirRequest: Pick<TypeInteraction, "level" | "resourceType">
): FHIRRequest {
  switch (request.method) {
    case "GET":
      return {
        query: fhirURL,
        type: "search-request",
        ...fhirRequest,
      };
    case "POST":
      return {
        type: "create-request",
        body: request.body as Resource,
        ...fhirRequest,
      };
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Type interaction '${request.method}' not supported`
        )
      );
  }
}

function parseSystemRequest(
  request: Koa.Request,
  fhirURL: FHIRURL,
  fhirRequest: Pick<SystemInteraction, "level">
): FHIRRequest {
  switch (request.method) {
    case "GET":
      return {
        query: fhirURL,
        type: "search-request",
        ...fhirRequest,
      };
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `System interaction '${request.method}' not supported`
        )
      );
  }
}

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

export function KoaRequestToFHIRRequest(
  url: string,
  request: Koa.Request
): FHIRRequest {
  const fhirQuery = parseQuery(url);
  const level = getInteractionLevel(fhirQuery);

  const method = request.method;
  const urlPieces = url.split("/");
  if (urlPieces.length === 1) {
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
        return {
          type: "invoke-request",
          level: "system",
          operation: urlPieces[0].slice(1),
          body: request.body as Resource,
        };
      }
    }
  } else if (urlPieces.length === 2) {
  } else if (urlPieces.length === 3) {
  } else if (urlPieces.length === 4) {
  }

  switch (level) {
    case "instance":
      if (!fhirQuery.resourceType)
        throw new OperationError(
          outcomeError(
            "invalid",
            "Invalid instance search no resourceType found"
          )
        );
      if (!fhirQuery.id)
        throw new OperationError(
          outcomeError("invalid", "Invalid instance search no ID found")
        );

      return parseInstantRequest(request, fhirQuery, {
        level: "instance",
        id: fhirQuery.id,
        resourceType: fhirQuery.resourceType,
      });
    case "type":
      if (!fhirQuery.resourceType)
        throw new OperationError(
          outcomeError("invalid", "Invalid Type search no resourceType found")
        );
      return parseTypeRequest(request, fhirQuery, {
        level: "type",
        resourceType: fhirQuery.resourceType,
      });
    case "system":
      return parseSystemRequest(request, fhirQuery, {
        level: "system",
      });
  }
}
