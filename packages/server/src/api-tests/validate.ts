import { expect, test } from "@jest/globals";
import { ValueSetExpand } from "@iguhealth/generated-ops/r4";
import {
  Observation,
  Patient,
  Practitioner,
  Questionnaire,
  QuestionnaireResponse,
  Resource,
  RiskAssessment,
} from "@iguhealth/fhir-types/r4/types";
import HTTPClient from "@iguhealth/client/http";
import { evaluate } from "@iguhealth/fhirpath";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

test("Bad Creation", async () => {
  const badPatient = { resourceType: "Patient", name: "bob" };
  // @ts-ignore
  expect(client.create({}, badPatient)).rejects.toThrow();
});

test("Bad expansion", async () => {
  const badExpansion = { urz: "123" };
  // @ts-ignore
  expect(
    // @ts-ignore
    client.invoke_type(ValueSetExpand.Op, {}, "ValueSet", badExpansion)
  ).rejects.toThrow();
});
