import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import {
  Bundle,
  Observation,
  Patient,
  Practitioner,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { evaluate } from "@iguhealth/fhirpath";
import { OperationError } from "@iguhealth/operation-outcomes";

const client = HTTPClient({
  url: "http://localhost:3000/w/system",
  getAccessToken: async function () {
    return "pub_token";
  },
});

const SETUP_BUNDLE: Bundle = {
  resourceType: "Bundle",
  type: "transaction",
  entry: [
    {
      fullUrl: "local_patient",
      request: {
        method: "POST",
        url: "Patient",
      },
      resource: {
        resourceType: "Patient",
        generalPractitioner: [{ reference: "local_practitioner" }],
      },
    },
    {
      fullUrl: "local_practitioner",
      request: {
        method: "POST",
        url: "Practitioner",
      },
      resource: {
        resourceType: "Practitioner",
        name: [{ given: ["Bob"] }],
      },
    },
    {
      request: {
        method: "POST",
        url: "Observation",
      },
      resource: {
        status: "final",
        code: {
          coding: [
            {
              code: "test",
            },
          ],
        },
        subject: {
          reference: "local_patient",
        },
        resourceType: "Observation",
      },
    },
    {
      request: {
        method: "POST",
        url: "Observation",
      },
      resource: {
        status: "final",
        code: {
          coding: [
            {
              code: "test2",
            },
          ],
        },
        subject: {
          reference: "local_patient",
        },
        resourceType: "Observation",
      },
    },
  ],
} as Bundle;

test("include test", async () => {
  let transactionResponse: Bundle = {
    resourceType: "Bundle",
    type: "transaction-response",
  } as Bundle;
  try {
    transactionResponse = await client.transaction({}, "4.0", SETUP_BUNDLE);
    const observations = transactionResponse.entry
      ?.filter((e) => e.resource?.resourceType === "Observation")
      .map((e) => e.resource as Observation);

    expect(observations?.length).toEqual(2);

    const includeResponse = await client.search_type({}, "4.0", "Observation", [
      {
        name: "_id",
        value: [observations?.[0].id as string],
      },
      {
        name: "_include",
        value: ["Observation:subject"],
      },
    ]);

    expect(includeResponse.resources?.length).toEqual(2);
    expect(includeResponse.resources?.[1].resourceType).toEqual("Patient");
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
    await client.transaction({}, "4.0", transaction);
  }
});

test("revinclude test", async () => {
  let transactionResponse: Bundle = {
    resourceType: "Bundle",
    type: "transaction-response",
  } as Bundle;
  try {
    transactionResponse = await client.transaction({}, "4.0", SETUP_BUNDLE);
    const patient = transactionResponse.entry
      ?.filter((e) => e.resource?.resourceType === "Patient")
      .map((e) => e.resource as Patient);

    expect(patient?.length).toEqual(1);

    const revIncludeResponse1 = await client.search_type({}, "4.0", "Patient", [
      {
        name: "_id",
        value: [patient?.[0].id as string],
      },
      {
        name: "_revinclude",
        value: ["Observation:subject"],
      },
    ]);

    expect(revIncludeResponse1.resources?.length).toEqual(3);
    expect(revIncludeResponse1.resources?.[1].resourceType).toEqual(
      "Observation",
    );
    expect(revIncludeResponse1.resources?.[2].resourceType).toEqual(
      "Observation",
    );

    const practitioner = transactionResponse.entry
      ?.filter((e) => e.resource?.resourceType === "Practitioner")
      .map((e) => e.resource as Practitioner);

    const revIncludeResponse2 = await client.search_type(
      {},
      "4.0",
      "Practitioner",
      [
        {
          name: "_id",
          value: [practitioner?.[0].id as string],
        },
        {
          name: "_revinclude",
          value: ["Patient:general-practitioner"],
        },
      ],
    );

    expect(revIncludeResponse2.resources?.length).toEqual(2);
    expect(revIncludeResponse2.resources?.[0].resourceType).toEqual(
      "Practitioner",
    );
    expect(revIncludeResponse2.resources?.[1].resourceType).toEqual("Patient");
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
    await client.transaction({}, "4.0", transaction);
  }
});
