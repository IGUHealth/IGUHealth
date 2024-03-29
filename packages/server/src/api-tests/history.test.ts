import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import {
  Patient,
  Practitioner,
  Resource,
  id,
} from "@iguhealth/fhir-types/lib/r4/types";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "pub_token";
  },
});

test("History test", async () => {
  const resources: Resource[] = [];
  const time = new Date().toISOString();
  try {
    const p = await client.create<Patient>({}, { resourceType: "Patient" });

    resources.push(p);
    expect(p.id).toBeDefined();
    await client.update({}, p.resourceType, p.id as id, p);
    const history = await client.historyInstance({}, "Patient", p.id as id);
    expect(history.length).toEqual(2);

    const p2 = await client.create<Patient>({}, { resourceType: "Patient" });
    resources.push(p2);
    expect(p2.id).toBeDefined();
    await client.update({}, p2.resourceType, p2.id as id, p2);
    const typeHistory = await client.historyType({}, "Patient", [
      { name: "_since", value: [time] },
    ]);
    expect(typeHistory.length).toEqual(4);

    const practitioner = await client.create<Practitioner>(
      {},
      { resourceType: "Practitioner" },
    );
    resources.push(practitioner);
    expect(practitioner.id).toBeDefined();
    await client.update(
      {},
      practitioner.resourceType,
      practitioner.id as id,
      practitioner,
    );
    const systemHistory = await client.historySystem({}, [
      { name: "_since", value: [time] },
    ]);
    expect(systemHistory.length).toEqual(6);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});

test("History test since versionid", async () => {
  const resources: Resource[] = [];
  try {
    const p = await client.create<Patient>({}, { resourceType: "Patient" });

    resources.push(p);
    expect(p.id).toBeDefined();
    await client.update({}, p.resourceType, p.id as id, p);
    const history = await client.historyInstance({}, "Patient", p.id as id);
    expect(history.length).toEqual(2);

    const p2 = await client.create<Patient>({}, { resourceType: "Patient" });
    resources.push(p2);
    expect(p2.id).toBeDefined();
    await client.update({}, p2.resourceType, p2.id as id, p2);
    const typeHistory = await client.historyType({}, "Patient", [
      { name: "_since-version", value: [p.meta?.versionId as id] },
    ]);
    expect(typeHistory.length).toEqual(3);

    const practitioner = await client.create<Practitioner>(
      {},
      { resourceType: "Practitioner" },
    );
    resources.push(practitioner);
    expect(practitioner.id).toBeDefined();
    await client.update(
      {},
      practitioner.resourceType,
      practitioner.id as id,
      practitioner,
    );
    const systemHistory = await client.historySystem({}, [
      { name: "_since-version", value: [p.meta?.versionId as id] },
    ]);
    expect(systemHistory.length).toEqual(5);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});
