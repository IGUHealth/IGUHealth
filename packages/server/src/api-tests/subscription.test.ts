import { expect, test } from "@jest/globals";
import pg from "pg";

import {
  QuestionnaireResponse,
  Subscription,
  Resource,
  Patient,
} from "@iguhealth/fhir-types/r4/types";
import HTTPClient from "@iguhealth/client/lib/http";

async function createWorkspace(workspace: string) {
  const pgClient = new pg.Client({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
    ssl: process.env["FHIR_DATABASE_SSL"] === "true",
  });
  await pgClient.connect();
  const res = await pgClient.query("select id from workspaces where id = $1", [
    workspace,
  ]);
  if (res.rows.length === 0) {
    await pgClient.query(
      "INSERT INTO workspaces (id, workspace) VALUES ($1, $2)",
      [workspace, { id: "test", name: "test" }]
    );
  }

  await pgClient.end();
}

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

const client2 = HTTPClient({
  url: "http://localhost:3000/w/test/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

test("No filter QR", async () => {
  await createWorkspace("test");
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
  };

  const resources: Resource[] = [];
  try {
    const qr: QuestionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      status: "completed",
      identifier: { system: "iguhealth-system", value: "test-qr" },
    };
    resources.push(await client.create({}, sub));
    resources.push(await client.create({}, qr));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await client2.search_type({}, "QuestionnaireResponse", [
      { name: "identifier", value: ["iguhealth-system|test-qr"] },
    ]);
    expect(response.resources.length).toEqual(1);
    await client2.delete(
      {},
      "QuestionnaireResponse",
      response.resources[0].id as string
    );
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as string);
      })
    );
  }
});

test("No filter QR", async () => {
  await createWorkspace("test");

  const sub: Subscription = {
    reason: "QR POST BACK",
    status: "active",
    channel: {
      type: "rest-hook",
      endpoint:
        "http://localhost:3000/w/test/api/v1/fhir/r4/QuestionnaireResponse",
    },
    criteria: "Patient?given=John",
    language: "en",
    resourceType: "Subscription",
  };

  const resources: Resource[] = [];
  try {
    resources.push(await client.create({}, sub));
    resources.push(
      await client.create(
        {},
        {
          resourceType: "Patient",
          name: [{ given: ["John"] }],
        }
      )
    );
    resources.push(
      await client.create(
        {},
        {
          resourceType: "Patient",
          name: [{ given: ["David"] }],
        }
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await client2.search_type({}, "Patient", []);
    expect(response.resources.length).toEqual(1);
    await client2.delete({}, "Patient", response.resources[0].id as string);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as string);
      })
    );
  }
});
