import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import {
  Questionnaire,
  QuestionnaireResponse,
  Resource,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/lib/versions";

const client = HTTPClient({
  url: "http://localhost:3000/w/system",
  getAccessToken: async function () {
    return "pub_token";
  },
});

test("INDEXING REFERENCE FOR QUESTIONNAIRERESPONSE", async () => {
  const questionnaireTemplate: Questionnaire = {
    url: "https://iguhealth.com/PREPARE",
    title: "TEST QUESTIONNAIRE",
    status: "active",
    resourceType: "Questionnaire",
  } as Questionnaire;
  const qrTemplate: QuestionnaireResponse = {
    status: "in-progress",
    resourceType: "QuestionnaireResponse",
    questionnaire: "https://iguhealth.com/PREPARE",
  } as QuestionnaireResponse;
  const resources: Resource[] = [];
  try {
    const q = await client.create({}, R4, questionnaireTemplate);
    resources.push(q);
    const qr = await client.create({}, R4, qrTemplate);
    resources.push(qr);

    expect(
      await client.search_type({}, R4, "QuestionnaireResponse", [
        { name: "questionnaire", value: [q.id as id] },
      ]),
    ).toEqual({
      resources: [qr],
    });

    expect(
      await client.search_type({}, R4, "QuestionnaireResponse", [
        { name: "questionnaire", value: [q.url as string] },
      ]),
    ).toEqual({
      resources: [qr],
    });

    expect(
      await client.search_type({}, R4, "Questionnaire", [
        { name: "url", value: ["https://iguhealth.com/PREPARE"] },
      ]),
    ).toEqual({
      resources: [q],
    });
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete_instance({}, R4, resourceType, id as id);
      }),
    );
  }
});

test("Type filter Memory", async () => {
  expect([
    ...new Set(
      (
        await client.search_system({}, R4, [
          { name: "_type", value: ["SearchParameter"] },
        ])
      ).resources.map((v) => v.resourceType),
    ),
  ]).toEqual(["SearchParameter"]);
});

test("Type filter", async () => {
  const questionnaireTemplate: Questionnaire = {
    url: "https://iguhealth.com/PREPARE",
    title: "TEST QUESTIONNAIRE",
    status: "active",
    resourceType: "Questionnaire",
  } as Questionnaire;
  const qrTemplate: QuestionnaireResponse = {
    status: "in-progress",
    resourceType: "QuestionnaireResponse",
    questionnaire: "https://iguhealth.com/PREPARE",
  } as QuestionnaireResponse;
  const resources: Resource[] = [];
  try {
    const q = await client.create({}, R4, questionnaireTemplate);
    resources.push(q);
    const qr = await client.create({}, R4, qrTemplate);
    resources.push(qr);

    expect(
      await client.search_system({}, R4, [
        { name: "_type", value: ["QuestionnaireResponse"] },
      ]),
    ).toEqual({
      resources: [qr],
    });

    expect(
      await client.search_system({}, R4, [
        { name: "_type", value: ["Questionnaire"] },
      ]),
    ).toEqual({
      resources: [q],
    });
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete_instance({}, R4, resourceType, id as id);
      }),
    );
  }
});

test("Memory type test", async () => {
  const primitiveSDSearch = await client.search_type(
    {},
    R4,
    "StructureDefinition",
    [
      { name: "kind", value: ["primitive-type"] },
      { name: "name", value: ["base64Binary"] },
    ],
  );
  expect(primitiveSDSearch.resources.length).toEqual(1);
  expect(primitiveSDSearch.resources[0].id).toEqual("base64Binary");
});

test("Memory type test with _count", async () => {
  const primitiveSDSearch = await client.search_type(
    {},
    R4,
    "StructureDefinition",
    [{ name: "_count", value: ["1"] }],
  );
  expect(primitiveSDSearch.resources.length).toEqual(1);
});

test("Encoding test", async () => {
  const questionnaireTemplate: Questionnaire = {
    url: "https://iguhealth.com/PREPARE",
    title: "test/encoding=123",
    status: "active",
    resourceType: "Questionnaire",
  } as Questionnaire;

  const resources: Resource[] = [];
  try {
    const q = await client.create({}, R4, questionnaireTemplate);
    resources.push(q);
    const q2 = await client.create({}, R4, {
      ...questionnaireTemplate,
      title: "test&encoding=3",
    });
    resources.push(q2);

    expect(
      await client.search_type({}, R4, "Questionnaire", [
        { name: "title", value: ["test/encoding=123"] },
      ]),
    ).toEqual({
      resources: [q],
    });

    expect(
      await client.search_type({}, R4, "Questionnaire", [
        { name: "title", value: ["test&encoding=3"] },
      ]),
    ).toEqual({
      resources: [q2],
    });
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete_instance({}, R4, resourceType, id as id);
      }),
    );
  }
});
