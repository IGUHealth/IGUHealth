import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import { OperationDefinition } from "@iguhealth/fhir-types";
import { evaluate } from "@iguhealth/fhirpath";

import { InvokeRequest } from "./types";
import { FHIRServerCTX } from "../fhirServer";

export async function resolveOperationDefinition(
  ctx: FHIRServerCTX,
  request: InvokeRequest
): Promise<OperationDefinition> {
  const { operation } = request;

  const operationDefinition = await ctx.database.search_type(
    ctx,
    "OperationDefinition",
    [{ name: "code", value: [operation] }]
  );
  if (operationDefinition.length === 0)
    throw new OperationError(
      outcomeError(
        "not-found",
        `Operation with code '${operation}' was not found.`
      )
    );
  if (operationDefinition.length > 1)
    throw new OperationError(
      outcomeError(
        "invalid",
        `Operation with code '${operation}' had several operation definitions present.`
      )
    );

  return operationDefinition[0];
}

export async function getOperationCode(
  ctx: FHIRServerCTX,
  operation: OperationDefinition
): Promise<string> {
  throw new Error();
}
