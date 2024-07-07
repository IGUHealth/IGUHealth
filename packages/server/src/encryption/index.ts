import jsonpatch, { Operation } from "fast-json-patch";

import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../fhir-api/types.js";
import { EncryptionProvider } from "./provider/interface.js";
import { AWSKMSProvider } from "./provider/kms.js";

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
  ctx: IGUHealthServerCTX,
  valueToEncrypt: T,
): Promise<T> {
  const encryptionProvider = ctx.encryptionProvider;
  if (!encryptionProvider)
    throw new OperationError(
      outcomeError("invalid", "No encryption provider configured."),
    );

  const encryptionLocations = await evaluateWithMeta(
    "$this.descendants().where($this.extension.url=%extUrl).value",
    valueToEncrypt,
    {
      variables: {
        extUrl: ENCRYPTION_URL,
      },
    },
  );
  const operations = await Promise.all(
    encryptionLocations.map(async (value): Promise<Operation[]> => {
      const encryptExtensionValue = await evaluateWithMeta(
        `${toFP(value.location())}.extension.where(url=%extUrl).value`,
        valueToEncrypt,
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

  const value = jsonpatch.applyPatch(valueToEncrypt, operations.flat());
  return value.newDocument;
}

export default function createEncryptionProvider():
  | EncryptionProvider
  | undefined {
  switch (process.env.ENCRYPTION_TYPE) {
    case "aws": {
      return new AWSKMSProvider({
        clientConfig: {
          credentials: {
            accessKeyId: process.env.AWS_KMS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_KMS_ACCESS_KEY_SECRET as string,
          },
        },
        generatorKeyARN: process.env.AWS_ENCRYPTION_GENERATOR_KEY as string,
        encryptorKeyARNS: [process.env.AWS_ENCRYPTION_KEY as string],
      });
    }

    default: {
      return undefined;
    }
  }
}
