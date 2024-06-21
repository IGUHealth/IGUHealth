import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import { code, uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/lib/versions";
import {
  CodeSystemLookup,
  ValueSetExpand,
  ValueSetValidateCode,
} from "@iguhealth/generated-ops/lib/r4/ops";

const client = HTTPClient({
  url: "http://localhost:3000/w/system",
  getAccessToken: async function () {
    return "pub_token";
  },
});

test("Hl7 Gender validation", async () => {
  const validationSuccess = await client.invoke_type(
    ValueSetValidateCode.Op,
    {},
    R4,
    "ValueSet",
    {
      url: "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1" as uri,
      code: "male" as code,
    },
  );
  expect(validationSuccess).toEqual({ result: true });
  const validationFail = await client.invoke_type(
    ValueSetValidateCode.Op,
    {},
    R4,
    "ValueSet",
    {
      url: "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1" as uri,
      code: "mae" as code,
    },
  );
  expect(validationFail).toEqual({ result: false });
});

test("nested test", async () => {
  const validationSuccess = await client.invoke_type(
    ValueSetValidateCode.Op,
    {},
    R4,
    "ValueSet",
    {
      url: "http://hl7.org/fhir/ValueSet/name-use|4.0.1" as uri,
      code: "maiden" as code,
    },
  );
  expect(validationSuccess).toEqual({ result: true });
  const validationFail = await client.invoke_type(
    ValueSetValidateCode.Op,
    {},
    R4,
    "ValueSet",
    {
      url: "http://hl7.org/fhir/ValueSet/name-use|4.0.1" as uri,
      code: "maide" as code,
    },
  );
  expect(validationFail).toEqual({ result: false });

  const expansion = await client.invoke_type(
    ValueSetExpand.Op,
    {},
    R4,
    "ValueSet",
    {
      url: "http://hl7.org/fhir/ValueSet/name-use|4.0.1" as uri,
    },
  );

  expect(expansion?.expansion?.contains).toEqual([
    {
      system: "http://hl7.org/fhir/name-use",
      code: "usual",
      version: "4.0.1",
      display: "Usual",
    },
    {
      system: "http://hl7.org/fhir/name-use",
      code: "official",
      version: "4.0.1",
      display: "Official",
    },
    {
      system: "http://hl7.org/fhir/name-use",
      code: "temp",
      version: "4.0.1",
      display: "Temp",
    },
    {
      system: "http://hl7.org/fhir/name-use",
      code: "nickname",
      version: "4.0.1",
      display: "Nickname",
    },
    {
      system: "http://hl7.org/fhir/name-use",
      code: "anonymous",
      version: "4.0.1",
      display: "Anonymous",
    },
    {
      system: "http://hl7.org/fhir/name-use",
      code: "old",
      version: "4.0.1",
      display: "Old",
      contains: [
        {
          system: "http://hl7.org/fhir/name-use",
          code: "maiden",
          version: "4.0.1",
          display: "Name changed for Marriage",
        },
      ],
    },
  ]);
});

test("Hl7 Name Lookup", async () => {
  const lookupName = await client.invoke_type(
    CodeSystemLookup.Op,
    {},
    R4,
    "CodeSystem",
    {
      system: "http://hl7.org/fhir/name-use" as uri,
      code: "maiden" as code,
    },
  );

  expect(lookupName).toEqual({
    name: "NameUse",
    version: "4.0.1",
    display: "Name changed for Marriage",
  });

  const lookupName2 = client.invoke_type(
    CodeSystemLookup.Op,
    {},
    R4,
    "CodeSystem",
    {
      system: "http://hl7.org/fhir/name-use" as uri,
      code: "not-there" as code,
    },
  );
  expect(lookupName2).rejects.toThrow();
});
