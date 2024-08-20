import Ajv from "ajv";

import { FHIRRequest } from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { code } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, ResourceType } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import JSONPatchSchema from "../..//json-schemas/schemas/jsonpatch.schema.json" with { type: "json" };
import { validateResource } from "../../fhir-operation-executors/providers/local/ops/resource_validate.js";
import { IGUHealthServerCTX, asRoot } from "../types.js";

function getResourceTypeToValidate(
  request: FHIRRequest,
): ResourceType<FHIR_VERSION> {
  switch (request.type) {
    case "create-request":
      return request.resourceType;
    case "update-request":
      return request.resourceType;
    case "invoke-request":
      return request.body.resourceType;
    case "transaction-request":
    case "batch-request":
      return "Bundle";
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          `cannot validate resource type '${request.type}'`,
        ),
      );
  }
}

/**
 * Used for JSON PATCH validation which is non FHIR data.
 */
const ajv = new Ajv.default({});
const validateJSONPatch = ajv.compile(JSONPatchSchema);

function createValidationMiddleware<State>(): MiddlewareAsyncChain<
  State,
  IGUHealthServerCTX
> {
  return async (context, next) => {
    switch (context.request.type) {
      case "update-request":
      case "create-request":
      case "batch-request":
      case "invoke-request":
      case "transaction-request": {
        const outcome = await validateResource(
          asRoot(context.ctx),
          context.request.fhirVersion,
          getResourceTypeToValidate(context.request),
          {
            mode: (context.request.type === "create-request"
              ? "create"
              : "update") as code,
            resource: context.request.body,
          },
        );

        if (
          outcome.issue.find(
            (i) => i.severity === "fatal" || i.severity === "error",
          )
        ) {
          throw new OperationError(outcome);
        }
        break;
      }
      case "patch-request": {
        const valid = validateJSONPatch(context.request.body);
        if (!valid) {
          throw new OperationError(
            outcomeError("invalid", ajv.errorsText(validateJSONPatch.errors)),
          );
        }
        break;
      }
    }

    return next(context);
  };
}

export default createValidationMiddleware;
