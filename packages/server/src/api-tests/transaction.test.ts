import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import { Bundle, Patient, code } from "@iguhealth/fhir-types/lib/r4/types";

const client = HTTPClient({
  url: "http://localhost:3000/w/system",
  getAccessToken: async function () {
    return "pub_token";
  },
});

test("test successful transaction", async () => {
  let transactionResponse: Bundle = {
    resourceType: "Bundle",
    type: "transaction-response" as code,
  } as Bundle;
  try {
    transactionResponse = await client.transaction({ fhirVersion: "4.0" }, {
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        {
          fullUrl: "urn:oid:2",
          request: {
            method: "POST",
            url: "Patient",
          },
          resource: {
            resourceType: "Patient",
            generalPractitioner: [{ reference: "urn:oid:1" }],
          },
        },
        {
          fullUrl: "urn:oid:1",
          request: {
            method: "POST",
            url: "Practitioner",
          },
          resource: {
            resourceType: "Practitioner",
            name: [{ given: ["Bob"] }],
          },
        },
      ],
    } as Bundle);

    expect(
      (transactionResponse.entry?.[0].resource as Patient)?.generalPractitioner,
    ).toEqual([
      {
        reference: `${transactionResponse.entry?.[1].resource?.resourceType}/${transactionResponse.entry?.[1].resource?.id}`,
      },
    ]);
  } finally {
    const transaction: Bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: (transactionResponse.entry || []).map((entry) => {
        return {
          request: { url: entry.response?.location || "", method: "DELETE" },
        };
      }),
    } as Bundle;
    await client.transaction({ fhirVersion: "4.0" }, transaction);
  }
});

test("test circular transaction", async () => {
  const response = client.transaction({ fhirVersion: "4.0" }, {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        fullUrl: "urn:oid:2",
        request: {
          method: "POST",
          url: "Patient",
        },
        resource: {
          resourceType: "Patient",
          generalPractitioner: [{ reference: "urn:oid:1" }],
        },
      },
      {
        fullUrl: "urn:oid:1",
        request: {
          method: "POST",
          url: "Practitioner",
        },
        resource: {
          extension: [
            { url: "test", valueReference: { reference: "urn:oid:2" } },
          ],
          resourceType: "Practitioner",
          name: [{ given: ["Bob"] }],
        },
      },
    ],
  } as Bundle);

  expect(response).rejects.toThrow();
});
