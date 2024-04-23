import { expect, test } from "@jest/globals";
import crypto from "node:crypto";

import { OperationDefinition } from "@iguhealth/fhir-types/lib/generated/r4/types";

import { testServices } from "../../fhir-storage/test-ctx.js";
import { encryptValue } from "../index.js";
import LocalEncryption from "./local.js";

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const provider = new LocalEncryption({ key, iv });

test("testLocal Encryption", async () => {
  expect(await provider.encrypt({}, "v")).not.toEqual("v");
  expect(await provider.decrypt({}, await provider.encrypt({}, "v"))).toEqual(
    "v",
  );
});

test("test resourceEncryption", async () => {
  const operationDefinition: OperationDefinition = {
    resourceType: "OperationDefinition",
    code: "test",
    name: "Test",
    status: "active",
    kind: "operation",
    instance: false,
    type: false,
    system: false,
    extension: [
      {
        url: "https://iguhealth.app/Extension/OperationDefinition/environment-variable",
        valueString: "secret",
        _valueString: {
          extension: [
            {
              url: "https://iguhealth.app/Extension/encrypt-value",
              valueString: "",
            },
          ],
        },
      },
    ],
  } as OperationDefinition;
  const encryptedOp = await encryptValue(
    { ...testServices, encryptionProvider: provider },
    operationDefinition,
  );

  expect(encryptedOp.extension?.[0].valueString).not.toEqual("secret");
  expect(encryptedOp.extension?.[0]?.valueString).toEqual(
    encryptedOp.extension?.[0]?._valueString?.extension?.[0]?.valueString,
  );
  expect(
    await provider.decrypt(
      {},
      encryptedOp.extension?.[0]?.valueString as string,
    ),
  ).toEqual("secret");
});
