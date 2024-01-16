import jsonpatch, { Operation } from "fast-json-patch";

import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../fhir/context.js";

function toFP(loc: (string | number)[]) {
  let FP = "$this";
  for (const field of loc) {
    if (typeof field === "string") FP = `${FP}.${field}`;
    else FP = `${FP}[${field}]`;
  }
  return FP;
}

export const ENCRYPTION_URL = "https://iguhealth.app/Extension/encrypt-value";

export async function encryptValue<T extends object>(
  ctx: FHIRServerCTX,
  resource: T,
): Promise<T> {
  const encryptionProvider = ctx.encryptionProvider;
  if (!encryptionProvider)
    throw new OperationError(
      outcomeError("invalid", "No encryption provider configured."),
    );

  const encryptionLocations = evaluateWithMeta(
    "$this.descendants().where($this.extension.url=%extUrl).value",
    resource,
    {
      variables: {
        extUrl: ENCRYPTION_URL,
      },
    },
  );
  const operations = await Promise.all(
    encryptionLocations.map(async (value): Promise<Operation[]> => {
      const encryptExtensionValue = evaluateWithMeta(
        `${toFP(value.location())}.extension.where(url=%extUrl).value`,
        resource,
        {
          variables: {
            extUrl: ENCRYPTION_URL,
          },
        },
      );
      if (encryptExtensionValue.length < 1) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Could not find extension at location to encrypt.",
            [toFP(value.location())],
          ),
        );
      }
      if (encryptExtensionValue.length > 1) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Error multiple encryption extensions found at location.",
            [toFP(value.location())],
          ),
        );
      }

      if (typeof value.valueOf() !== "string") {
        throw new OperationError(
          outcomeError("invalid", "Cannot encrypt a non string value.", [
            toFP(value.location()),
          ]),
        );
      }

      if (encryptExtensionValue[0].valueOf() !== value.valueOf()) {
        const encryptedValue = await encryptionProvider.encrypt(
          { workspace: ctx.tenant },
          value.valueOf() as string,
        );
        return [
          {
            op: "replace",
            path: `/${value.location().join("/")}`,
            value: encryptedValue,
          },
          {
            op: "replace",
            path: `/${encryptExtensionValue[0].location().join("/")}`,
            value: encryptedValue,
          },
        ];
      }

      return [];
    }),
  );

  const value = jsonpatch.applyPatch(resource, operations.flat());
  return value.newDocument;
}
