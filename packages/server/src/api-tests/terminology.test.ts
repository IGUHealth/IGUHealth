import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import {
  ValueSetExpand,
  ValueSetValidateCode,
} from "@iguhealth/generated-ops/r4";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

test("Hl7 Gender expansion", async () => {
  const valuesetExpanded = await client.invoke_type(
    ValueSetExpand.Op,
    {},
    "ValueSet",
    {
      url: "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1",
    }
  );
  expect(valuesetExpanded?.expansion?.contains).toEqual([
    {
      system: "http://hl7.org/fhir/administrative-gender",
      code: "male",
      version: "4.0.1",
      display: "Male",
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/codesystem-concept-comments",
          valueString: "Male",
        },
      ],
    },
    {
      system: "http://hl7.org/fhir/administrative-gender",
      code: "female",
      version: "4.0.1",
      display: "Female",
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/codesystem-concept-comments",
          valueString: "Female",
        },
      ],
    },
    {
      system: "http://hl7.org/fhir/administrative-gender",
      code: "other",
      version: "4.0.1",
      display: "Other",
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/codesystem-concept-comments",
          valueString:
            "The administrative gender is a value other than male/female/unknown. Where this value is selected, systems may often choose to include an extension with the localized more specific value.",
        },
      ],
    },
    {
      system: "http://hl7.org/fhir/administrative-gender",
      code: "unknown",
      version: "4.0.1",
      display: "Unknown",
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/codesystem-concept-comments",
          valueString:
            'A proper value is applicable, but not known.  Usage Notes: This means the actual value is not known. If the only thing that is unknown is how to properly express the value in the necessary constraints (value set, datatype, etc.), then the OTH or UNC flavor should be used. No properties should be included for a datatype with this property unless:  Those properties themselves directly translate to a semantic of "unknown". (E.g. a local code sent as a translation that conveys \'unknown\') Those properties further qualify the nature of what is unknown. (E.g. specifying a use code of "H" and a URL prefix of "tel:" to convey that it is the home phone number that is unknown.)',
        },
      ],
    },
  ]);
});

test("Hl7 Gender valiadtion", async () => {
  const validationSuccess = await client.invoke_type(
    ValueSetValidateCode.Op,
    {},
    "ValueSet",
    {
      url: "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1",
      code: "male",
    }
  );
  expect(validationSuccess).toEqual({ result: true });
  const validationFail = await client.invoke_type(
    ValueSetValidateCode.Op,
    {},
    "ValueSet",
    {
      url: "http://hl7.org/fhir/ValueSet/administrative-gender|4.0.1",
      code: "mae",
    }
  );
  expect(validationFail).toEqual({ result: false });
});
