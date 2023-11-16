import { Resource } from "@iguhealth/fhir-types/r4/types";
import { evaluateWithMeta } from "@iguhealth/fhirpath";
import jsonpatch, { Operation } from "fast-json-patch";

import { EncryptionProvider } from "./provider/interface.js";
import { FHIRServerCTX } from "../ctx/types.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

function toFP(loc: (string | number)[]) {
  return loc
    .map((v) => {
      if (typeof v === "string") return v;
      return `[${v}]`;
    })
    .join(".");
}

export async function encryptResource<T extends Resource>(
  ctx: FHIRServerCTX,
  provider: EncryptionProvider,
  resource: T
): Promise<T> {
  const encryptionLocations = evaluateWithMeta(
    "$this.descendants().where($this.extension.url=%extUrl).value",
    resource
  );
  const operations = await Promise.all(
    encryptionLocations.map(async (metaValue): Promise<Operation[]> => {
      const extension = evaluateWithMeta(
        `${toFP(metaValue.location())}.extension.where(url=%extUrl).value`,
        resource
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
        const encryptedValue = await provider.encrypt(
          { workspace: ctx.workspace },
          value
        );
        return [
          {
            op: "replace",
            path: metaValue.location().join("/"),
            value: encryptedValue,
          },
          {
            op: "replace",
            path: extension[0].location().join("/"),
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
