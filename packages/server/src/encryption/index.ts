import jsonpatch, { Operation } from "fast-json-patch";
import jsonpointer from "jsonpointer";

import { Extension } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../fhir-server/types.js";
import { EncryptionProvider } from "./provider/interface.js";
import { AWSKMSProvider } from "./provider/kms.js";

export const ENCRYPTION_URL = "https://iguhealth.app/Extension/encrypt-value";

function toJSONPath(loc: (string | number)[] | undefined) {
  if (!loc)
    throw new OperationError(outcomeError("invalid", "Location is undefined."));
  return `/${loc.join("/")}`;
}

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
      const location = value.location();
      if (!location)
        throw new OperationError(
          outcomeError("invalid", "Location is undefined."),
        );
      const encryptExt = [
        ...location.slice(0, -1),
        `_${location[location.length - 1]}`,
        "extension",
      ];
      const encryptExtensionValue: [Extension, string][] = jsonpointer
        .get(valueToEncrypt, toJSONPath(encryptExt))
        .map((ext: Extension, i: number) => [
          ext,
          toJSONPath([...encryptExt, i, "valueString"]),
        ])
        .filter(([ext]: [Extension, string]) => ext.url === ENCRYPTION_URL);

      if (encryptExtensionValue.length < 1) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Could not find extension at location to encrypt.",
            [value.location()?.join("/") ?? ""],
          ),
        );
      }
      if (encryptExtensionValue.length > 1) {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Error multiple encryption extensions found at location.",
            [value.location()?.join("/") ?? ""],
          ),
        );
      }

      if (typeof value.getValue() !== "string") {
        throw new OperationError(
          outcomeError("invalid", "Cannot encrypt a non string value.", [
            value.location()?.join("/") ?? "",
          ]),
        );
      }

      if (encryptExtensionValue[0][0].valueString !== value.getValue()) {
        const encryptedValue = await encryptionProvider.encrypt(
          { workspace: ctx.tenant },
          value.getValue() as string,
        );

        return [
          {
            op: "replace",
            path: toJSONPath(value.location()),
            value: encryptedValue,
          },
          {
            op: "replace",
            path: encryptExtensionValue[0][1],
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
