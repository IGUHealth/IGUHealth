import { expect, test } from "@jest/globals";

import {
  Observation,
  Patient,
  Practitioner,
  Questionnaire,
  QuestionnaireResponse,
  Resource,
  RiskAssessment,
} from "@iguhealth/fhir-types/r4/types";
import HTTPClient from "@iguhealth/client/lib/http";
import { evaluate } from "@iguhealth/fhirpath";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

test("History test", async () => {
  const resources: Resource[] = [];
  const time = new Date().toISOString();
  try {
    const p = await client.create<Patient>({}, { resourceType: "Patient" });

    resources.push(p);
    expect(p.id).toBeDefined();
    const patient = await client.update({}, p);
    const history = await client.historyInstance({}, "Patient", p.id as string);
    expect(history.length).toEqual(2);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as string);
      })
    );
  }
});
