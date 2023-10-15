import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";
import { OperationDefinition } from "@iguhealth/fhir-types/r4/types";
import { evaluate } from "@iguhealth/fhirpath";
import AdmZip from "adm-zip";
import { OpCTX } from "@iguhealth/operation-execution";

import { InvokeRequest } from "./types.js";
import { FHIRServerCTX } from "../fhirServer.js";

export async function resolveOperationDefinition(
  ctx: FHIRServerCTX,
  operationCode: string
): Promise<OperationDefinition> {
  const operationDefinition = await ctx.client.search_type(
    ctx,
    "OperationDefinition",
    [{ name: "code", value: [operationCode] }]
  );
  if (operationDefinition.resources.length === 0)
    throw new OperationError(
      outcomeError(
        "not-found",
        `Operation with code '${operationCode}' was not found.`
      )
    );
  if (operationDefinition.resources.length > 1)
    throw new OperationError(
      outcomeError(
        "invalid",
        `Operation with code '${operationCode}' had several operation definitions present.`
      )
    );

  return operationDefinition.resources[0];
}

const EXT_URL =
  "https://iguhealth.github.io/fhir-operation-definition/operation-code";

export async function getOperationCode(
  ctx: FHIRServerCTX,
  operation: OperationDefinition
): Promise<string | undefined> {
  const code = evaluate(
    "$this.extension.where(url=%codeUrl).valueString",
    operation,
    {
      variables: {
        codeUrl: EXT_URL,
      },
    }
  );
  if (code.length === 0) return undefined;
  if (typeof code[0] !== "string")
    throw new OperationError(
      outcomeFatal(
        "invalid",
        "Expected code to be a string for operation '${operation.id}'"
      )
    );

  return code[0];
}

export function getOpCTX(ctx: FHIRServerCTX, request: InvokeRequest): OpCTX {
  return {
    level: request.level,
    validateCode: async (url: string, code: string) => {
      const result = await ctx.terminologyProvider.validate(ctx, {
        code,
        url,
      });
      return result.result;
    },
    resolveSD: (type: string) => {
      const sd = ctx.resolveSD(ctx, type);
      if (!sd)
        throw new OperationError(
          outcomeFatal("invalid", `Could not resolve type '${type}'`)
        );
      return sd;
    },
  };
}

function validateLevel(operation: OperationDefinition, request: InvokeRequest) {
  switch (request.level) {
    case "system": {
      if (!operation.system)
        throw new OperationError(
          outcomeError(
            "invalid",
            "Operation does not support system level invocation"
          )
        );
      break;
    }
    case "type":
      if (!operation.type) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Operation does not support type level invocation"
          )
        );
      }
      break;
    case "instance":
      if (!operation.instance) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Operation does not support instance level invocation"
          )
        );
      }
      break;
  }
}

function validateInvocationContext(
  operation: OperationDefinition,
  request: InvokeRequest
) {}
