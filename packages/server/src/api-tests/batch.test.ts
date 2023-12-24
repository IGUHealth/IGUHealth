import { expect, test } from "@jest/globals";

import { Bundle, code } from "@iguhealth/fhir-types/r4/types";
import HTTPClient from "@iguhealth/client/http";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

test("test batch", async () => {
  let response: Bundle = {
    resourceType: "Bundle",
    type: "batch" as code,
    entry: [],
  } as Bundle;
  try {
    response = await client.batch({}, {
      resourceType: "Bundle",
      type: "batch",
      entry: [
        {
          request: {
            method: "POST",
            url: "Patient",
          },
          resource: {
            resourceType: "Patient",
          },
        },
        {
          request: {
            method: "POST",
            url: "Practitioner",
          },
          resource: {
            resourceType: "Practitioner",
          },
        },
      ],
    } as Bundle);
    expect(response.entry?.[0].resource?.resourceType).toEqual("Patient");
    expect(response.entry?.[0].resource).toHaveProperty("id");
    expect(response.entry?.[1].resource?.resourceType).toEqual("Practitioner");
    expect(response.entry?.[1].resource).toHaveProperty("id");
  } finally {
    const bundle: Bundle = {
      resourceType: "Bundle",
      type: "batch",
      entry: (response.entry || []).map((entry) => {
        return {
          request: { url: entry.request?.url || "", method: "DELETE" },
        };
      }),
    } as Bundle;
    await client.batch({}, bundle);
  }
});
