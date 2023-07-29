import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";
import { OperationDefinition } from "@iguhealth/fhir-types";
import { evaluate } from "@iguhealth/fhirpath";
import AdmZip from "adm-zip";

import { InvokeRequest } from "./types";
import { FHIRServerCTX } from "../fhirServer";
import { Stream } from "stream";

export async function resolveOperationDefinition(
  ctx: FHIRServerCTX,
  request: InvokeRequest
): Promise<OperationDefinition> {
  const { operation } = request;

  const operationDefinition = await ctx.client.search_type(
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

const EXT_URL =
  "https://iguhealth.github.io/fhir-operation-definition/operation-code";

export async function getOperationCode(
  ctx: FHIRServerCTX,
  operation: OperationDefinition
): Promise<Buffer | undefined> {
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

  const stream = new Stream.Writable();
  const zip = new AdmZip();
  zip.addFile("index.js", Buffer.alloc(code[0].length, code[0]), "executable");

  return zip.toBuffer();
}
