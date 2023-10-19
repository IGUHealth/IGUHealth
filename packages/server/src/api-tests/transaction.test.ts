import { expect, test } from "@jest/globals";
import { Patient } from "@iguhealth/fhir-types/r4/types";

import { Bundle } from "@iguhealth/fhir-types/r4/types";
import HTTPClient from "@iguhealth/client/http";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

test("test successful transaction", async () => {
  let transactionResponse: Bundle = {
    resourceType: "Bundle",
    type: "transaction-response",
    entry: [],
  };
  try {
    transactionResponse = await client.transaction(
      {},
      {
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
      }
    );

    expect(
      (transactionResponse.entry?.[0].resource as Patient)?.generalPractitioner
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
    };
    await client.transaction({}, transaction);
  }
});

test("test circular transaction", async () => {
  const response = client.transaction(
    {},
    {
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
    }
  );

  expect(response).rejects.toThrow();
});
