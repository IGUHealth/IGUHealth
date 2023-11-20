import { Resource } from "@iguhealth/fhir-types/r4/types";
import { evaluateWithMeta } from "@iguhealth/fhirpath";
import jsonpatch, { Operation } from "fast-json-patch";

import { FHIRServerCTX } from "../ctx/types.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

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
  resource: T
): Promise<T> {
  const encryptionProvider = ctx.encryptionProvider;
  if (!encryptionProvider)
    throw new OperationError(
      outcomeError("invalid", "No encryption provider configured.")
    );

  const encryptionLocations = evaluateWithMeta(
    "$this.descendants().where($this.extension.url=%extUrl).value",
    resource,
    {
      variables: {
        extUrl: ENCRYPTION_URL,
      },
    }
  );
  const operations = await Promise.all(
    encryptionLocations.map(async (metaValue): Promise<Operation[]> => {
      console.log(
        `${toFP(metaValue.location())}.extension.where(url=%extUrl).value`
      );
      const extension = evaluateWithMeta(
        `${toFP(metaValue.location())}.extension.where(url=%extUrl).value`,
        resource,
        {
          variables: {
            extUrl: ENCRYPTION_URL,
          },
        }
      );
      if (extension.length < 1) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Could not find extension at location to encrypt.",
            [toFP(metaValue.location())]
          )
        );
      }
      if (extension.length > 1) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Error multiple encryption extensions found at location.",
            [toFP(metaValue.location())]
          )
        );
      }
      const value = metaValue.valueOf();
      if (typeof value !== "string") {
        throw new OperationError(
          outcomeError("invalid", "Cannot encrypt a non string value.", [
            toFP(metaValue.location()),
          ])
        );
      }

      if (extension.valueOf() !== metaValue.valueOf()) {
        const encryptedValue = await encryptionProvider.encrypt(
          { workspace: ctx.workspace },
          value
        );
        return [
          {
            op: "replace",
            path: `/${metaValue.location().join("/")}`,
            value: encryptedValue,
          },
          {
            op: "replace",
            path: `/${extension[0].location().join("/")}`,
            value: encryptedValue,
          },
        ];
      }

      return [];
    })
  );

  const value = jsonpatch.applyPatch(resource, operations.flat());
  return value.newDocument;
}
