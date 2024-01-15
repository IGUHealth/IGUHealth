import { FHIRClientAsync } from "@iguhealth/client/interface";
import { InvokeRequest } from "@iguhealth/client/types";
import {
  OperationDefinition,
  OperationOutcome,
  code,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { evaluate } from "@iguhealth/fhirpath";
import { OpCTX } from "@iguhealth/operation-execution";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../fhir/context.js";

export async function resolveOperationDefinition<
  CTX,
  Client extends FHIRClientAsync<CTX>,
>(
  client: Client,
  ctx: CTX,
  operationCode: string,
): Promise<OperationDefinition> {
  const operationDefinition = await client.search_type(
    ctx,
    "OperationDefinition",
    [{ name: "code", value: [operationCode] }],
  );
  if (operationDefinition.resources.length === 0)
    throw new OperationError(
      outcomeError(
        "not-found",
        `Operation with code '${operationCode}' was not found.`,
      ),
    );
  if (operationDefinition.resources.length > 1)
    throw new OperationError(
      outcomeError(
        "invalid",
        `Operation with code '${operationCode}' had several operation definitions present.`,
      ),
    );

  return operationDefinition.resources[0];
}

const EXT_URL =
  "https://iguhealth.github.io/fhir-operation-definition/operation-code";

export async function getOperationCode(
  ctx: FHIRServerCTX,
  operation: OperationDefinition,
): Promise<string | undefined> {
  const code = evaluate(
    "$this.extension.where(url=%codeUrl).valueString",
    operation,
    {
      variables: {
        codeUrl: EXT_URL,
      },
    },
  );
  if (code.length === 0) return undefined;
  if (typeof code[0] !== "string")
    throw new OperationError(
      outcomeFatal(
        "invalid",
        "Expected code to be a string for operation '${operation.id}'",
      ),
    );

  return code[0];
}

export function getOpCTX(ctx: FHIRServerCTX, request: InvokeRequest): OpCTX {
  return {
    level: request.level,
    validateCode: async (url: string, code: string) => {
      const result = await ctx.terminologyProvider.validate(ctx, {
        code: code as code,
        url: url as uri,
      });
      return result.result;
    },
    resolveTypeToCanonical: ctx.resolveTypeToCanonical,
    resolveCanonical: ctx.resolveCanonical,
  };
}

function validateLevel(operation: OperationDefinition, request: InvokeRequest) {
  switch (request.level) {
    case "system": {
      if (!operation.system)
        return outcomeError(
          "invalid",
          "Operation does not support system level invocation",
        );

      break;
    }
    case "type":
      if (!operation.type) {
        return outcomeError(
          "invalid",
          "Operation does not support type level invocation",
        );
      }
      break;
    case "instance":
      if (!operation.instance) {
        return outcomeError(
          "invalid",
          "Operation does not support instance level invocation",
        );
      }
      break;
  }
}

export function validateInvocationContext(
  operation: OperationDefinition,
  request: InvokeRequest,
): OperationOutcome | undefined {
  const issues = validateLevel(operation, request);
  if (issues) return issues;

  if (request.level === "instance" || request.level === "type") {
    if (operation.resource?.includes("Resource" as code)) {
      return;
    } else if (!operation.resource?.includes(request.resourceType as code))
      return outcomeError(
        "invalid",
        `Invalid resourcetype on invocation request '${
          request.resourceType
        }' expected one of '${operation.resource?.join(", ")}'`,
      );
  }
}
