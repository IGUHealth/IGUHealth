import { expect, test } from "@jest/globals";
import dotEnv from "dotenv";
import pg from "pg";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import HTTPClient from "@iguhealth/client/lib/http";
import {
  Encounter,
  Patient,
  Questionnaire,
  QuestionnaireResponse,
  Resource,
  Subscription,
  id,
} from "@iguhealth/fhir-types/lib/r4/types";

dotEnv.config();

async function createTenant(tenant: string) {
  const pgClient = new pg.Client({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
    ssl: process.env["FHIR_DATABASE_SSL"] === "true",
  });
  await pgClient.connect();
  try {
    const res = await db.sql<
      s.tenants.SQL,
      s.tenants.Selectable[]
    >`SELECT ${"id"} FROM ${"tenants"} WHERE ${{ id: tenant }}`.run(pgClient);

    if (res.length === 0) {
      await db
        .insert("tenants", {
          id: tenant,
          tenant: { id: "test", name: "test" },
        })
        .run(pgClient);
    }
  } finally {
    await pgClient.end();
  }
}

function createClient(tenant: string) {
  return HTTPClient({
    url: `http://localhost:3000/w/${tenant}`,
    getAccessToken: async function () {
      return "pub_token";
    },
  });
}

test("No filter QR", async () => {
  await createTenant("test");
  const client = createClient("system");
  const client2 = createClient("test");

  const sub: Subscription = {
    reason: "QR POST BACK",
    status: "active",
    channel: {
      type: "rest-hook",
      endpoint:
        "http://localhost:3000/w/test/api/v1/fhir/r4/QuestionnaireResponse",
    },
    criteria: "QuestionnaireResponse",
    language: "en",
    resourceType: "Subscription",
  } as Subscription;

  const resources: Resource[] = [];
  try {
    const qr: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "completed",
      identifier: { system: "iguhealth-system", value: "test-qr" },
    } as QuestionnaireResponse;
    resources.push(await client.create({ fhirVersion: "4.0" }, sub));
    resources.push(await client.create({ fhirVersion: "4.0" }, qr));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await client2.search_type(
      { fhirVersion: "4.0" },
      "QuestionnaireResponse",
      [{ name: "identifier", value: ["iguhealth-system|test-qr"] }],
    );
    expect(response.resources.length).toEqual(1);
    await client2.delete(
      { fhirVersion: "4.0" },
      "QuestionnaireResponse",
      response.resources[0].id as id,
    );
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete(
          { fhirVersion: "4.0" },
          resourceType,
          id as id,
        );
      }),
    );
  }
});

test("Filter patient sub ", async () => {
  await createTenant("test");
  const client = createClient("system");
  const client2 = createClient("test");

  const sub: Subscription = {
    reason: "Patient post back",
    status: "active",
    channel: {
      type: "rest-hook",
      endpoint: "http://localhost:3000/w/test/api/v1/fhir/r4/Patient",
    },
    criteria: "Patient?given=John",
    language: "en",
    resourceType: "Subscription",
  } as Subscription;

  const resources: Resource[] = [];
  try {
    resources.push(await client.create({ fhirVersion: "4.0" }, sub));
    resources.push(
      await client.create(
        { fhirVersion: "4.0" },
        {
          resourceType: "Patient",
          name: [{ given: ["John"] }],
        },
      ),
    );
    resources.push(
      await client.create(
        { fhirVersion: "4.0" },
        {
          resourceType: "Patient",
          name: [{ given: ["David"] }],
        },
      ),
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await client2.search_type(
      { fhirVersion: "4.0" },
      "Patient",
      [],
    );
    expect(response.resources.length).toEqual(1);
    await client2.delete(
      { fhirVersion: "4.0" },
      "Patient",
      response.resources[0].id as id,
    );
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete(
          { fhirVersion: "4.0" },
          resourceType,
          id as id,
        );
      }),
    );
  }
});

test("name check", async () => {
  await createTenant("test2");
  const client = createClient("system");
  const client2 = createClient("test2");

  const sub: Subscription = {
    reason: "Patient post back",
    status: "active",
    channel: {
      type: "rest-hook",
      endpoint: "http://localhost:3000/w/test2/api/v1/fhir/r4/Patient",
    },
    criteria: "Patient?name=Marko1",
    language: "en",
    resourceType: "Subscription",
  } as Subscription;

  const resources: Resource[] = [];
  try {
    resources.push(await client.create({ fhirVersion: "4.0" }, sub));
    resources.push(
      await client.create(
        { fhirVersion: "4.0" },
        {
          resourceType: "Patient",
          name: [{ given: ["Marko1"] }],
        },
      ),
    );
    resources.push(
      await client.create(
        { fhirVersion: "4.0" },
        {
          resourceType: "Patient",
          name: [{ given: ["David"] }],
        },
      ),
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await client2.search_type(
      { fhirVersion: "4.0" },
      "Patient",
      [],
    );
    expect(response.resources.length).toEqual(1);
    await client2.delete(
      { fhirVersion: "4.0" },
      "Patient",
      response.resources[0].id as id,
    );
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete(
          { fhirVersion: "4.0" },
          resourceType,
          id as id,
        );
      }),
    );
  }
});

test("Reference canonical", async () => {
  await createTenant("ref-check");
  const client = createClient("system");
  const client2 = createClient("ref-check");
  const resources: Resource[] = [];
  try {
    resources.push(
      await client.create({ fhirVersion: "4.0" }, {
        reason: "Patient post back",
        status: "active",
        channel: {
          type: "rest-hook",
          endpoint:
            "http://localhost:3000/w/ref-check/api/v1/fhir/r4/QuestionnaireResponse",
        },
        criteria: "QuestionnaireResponse?questionnaire=ahc-questionnaire",
        language: "en",
        resourceType: "Subscription",
      } as Subscription),
    );
    resources.push(
      await client.create({ fhirVersion: "4.0" }, {
        resourceType: "Questionnaire",
        url: "ahc-questionnaire",
        status: "active",
      } as Questionnaire),
    );

    resources.push(
      await client.create({ fhirVersion: "4.0" }, {
        resourceType: "QuestionnaireResponse",
        questionnaire: "ahc-questionnaire",
        status: "completed",
      } as QuestionnaireResponse),
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    let qrs = await client2.search_type(
      { fhirVersion: "4.0" },
      "QuestionnaireResponse",
      [],
    );
    expect(qrs.resources[0].questionnaire).toEqual("ahc-questionnaire");

    // Confirm additional QRS aren't getting pushed
    resources.push(
      await client.create({ fhirVersion: "4.0" }, {
        resourceType: "QuestionnaireResponse",
        questionnaire: "unknown-questionnaire",
        status: "completed",
      } as QuestionnaireResponse),
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    qrs = await client2.search_type(
      { fhirVersion: "4.0" },
      "QuestionnaireResponse",
      [],
    );
    expect(qrs.resources.length).toEqual(1);

    for (const qr of qrs.resources) {
      await client2.delete(
        { fhirVersion: "4.0" },
        "QuestionnaireResponse",
        qr.id as id,
      );
    }
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete(
          { fhirVersion: "4.0" },
          resourceType,
          id as id,
        );
      }),
    );
  }
});

test("Reference standard", async () => {
  await createTenant("ref-check");
  const client = createClient("system");
  const client2 = createClient("ref-check");
  const resources: Resource[] = [];
  try {
    const patient: Patient = await client.create(
      { fhirVersion: "4.0" },
      { resourceType: "Patient" },
    );
    resources.push(patient);
    const sub = await client.create({ fhirVersion: "4.0" }, {
      reason: "Patient post back",
      status: "active",
      channel: {
        type: "rest-hook",
        endpoint: "http://localhost:3000/w/ref-check/api/v1/fhir/r4/Encounter",
      },
      criteria: `Encounter?patient=${patient.id}`,
      language: "en",
      resourceType: "Subscription",
    } as Subscription);
    resources.push(sub);
    resources.push(
      await client.create({ fhirVersion: "4.0" }, {
        resourceType: "Encounter",
        status: "finished",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "IMP",
          display: "inpatient encounter",
        },
        subject: {
          reference: `Patient/${patient.id}`,
        },
      } as Encounter),
    );

    resources.push(
      await client.create({ fhirVersion: "4.0" }, {
        resourceType: "Encounter",
        status: "finished",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "IMP",
          display: "inpatient encounter",
        },
        subject: {
          reference: "Patient/1",
        },
      } as Encounter),
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    let encounters = await client2.search_type(
      { fhirVersion: "4.0" },
      "Encounter",
      [],
    );
    expect(encounters.resources.length).toEqual(1);
    expect(encounters.resources[0]?.subject?.reference).toEqual(
      `Patient/${patient.id}`,
    );

    await client2.delete(
      { fhirVersion: "4.0" },
      "Encounter",
      encounters.resources[0].id as id,
    );

    await client.update(
      { fhirVersion: "4.0" },
      "Subscription",
      sub.id as id,
      {
        ...sub,
        criteria: `Encounter?patient=Patient/${patient.id}`,
      } as Subscription,
    );
    resources.push(
      await client.create({ fhirVersion: "4.0" }, {
        resourceType: "Encounter",
        status: "finished",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "IMP",
          display: "inpatient encounter",
        },
        subject: {
          reference: `Patient/${patient.id}`,
        },
      } as Encounter),
    );

    resources.push(
      await client.create({ fhirVersion: "4.0" }, {
        resourceType: "Encounter",
        status: "finished",
        class: {
          system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          code: "IMP",
          display: "inpatient encounter",
        },
        subject: {
          reference: "Patient/1",
        },
      } as Encounter),
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    encounters = await client2.search_type(
      { fhirVersion: "4.0" },
      "Encounter",
      [],
    );
    expect(encounters.resources.length).toEqual(1);
    expect(encounters.resources[0]?.subject?.reference).toEqual(
      `Patient/${patient.id}`,
    );

    await client2.delete(
      { fhirVersion: "4.0" },
      "Encounter",
      encounters.resources[0].id as id,
    );
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete(
          { fhirVersion: "4.0" },
          resourceType,
          id as id,
        );
      }),
    );
  }
}, 10000);
