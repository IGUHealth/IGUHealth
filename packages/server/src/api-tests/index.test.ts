import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import {
  Observation,
  Patient,
  Practitioner,
  Questionnaire,
  QuestionnaireResponse,
  Resource,
  RiskAssessment,
  id,
} from "@iguhealth/fhir-types/lib/r4/types";
import { evaluate } from "@iguhealth/fhirpath";
import { OperationError } from "@iguhealth/operation-outcomes";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "pub_token";
  },
});

const patient: Patient = {
  name: [
    {
      use: "official",
      given: ["Eve"],
      family: "Everywoman",
    },
  ],
  active: true,
  gender: "female",
  address: [
    {
      use: "home",
      line: ["2222 Home Street"],
    },
  ],
  telecom: [
    {
      use: "work",
      value: "555-555-2003",
      system: "phone",
    },
  ],
  birthDate: "1973-05-31",
  identifier: [
    {
      type: {
        coding: [
          {
            code: "SS",
            system: "http://terminology.hl7.org/CodeSystem/v2-0203",
          },
        ],
      },
      value: "444222222",
      system: "http://hl7.org/fhir/sid/us-ssn",
    },
  ],
  resourceType: "Patient",
  managingOrganization: {
    reference: "Organization/hl7",
  },
} as Patient;

const practitioner: Practitioner = {
  name: [
    {
      family: "Careful",
      prefix: ["Dr"],
    },
  ],
  text: {
    div: '<div xmlns="http://www.w3.org/1999/xhtml">\n      <p>Dr Adam Careful is a Referring Practitioner for Acme Hospital from 1-Jan 2012 to 31-Mar\n        2012</p>\n    </div>',
    status: "generated",
  },
  active: true,
  address: [
    {
      use: "home",
      city: "PleasantVille",
      line: ["534 Erewhon St"],
      state: "Vic",
      postalCode: "3999",
    },
  ],
  identifier: [
    {
      value: "23",
      system: "http://www.acme.org/practitioners",
    },
  ],
  resourceType: "Practitioner",
  qualification: [
    {
      code: {
        text: "Bachelor of Science",
        coding: [
          {
            code: "BS",
            system: "http://terminology.hl7.org/CodeSystem/v2-0360/2.7",
            display: "Bachelor of Science",
          },
        ],
      },
      period: {
        start: "1995",
      },
      identifier: [
        {
          value: "12345",
          system: "http://example.org/UniversityIdentifier",
        },
      ],
    },
  ],
} as Practitioner;

const observation: Observation = {
  id: "a8f910df-f9dd-4812-81b3-cd46bcf2ee14",
  code: {
    coding: [
      {
        code: "15074-8",
        system: "http://loinc.org",
        display: "Glucose [Moles/volume] in Blood",
      },
    ],
  },
  meta: {
    versionId: "2",
    lastUpdated: "2023-08-03T02:28:29.790+00:00",
  },
  text: {
    div: "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: f001</p><p><b>identifier</b>: 6323 (OFFICIAL)</p><p><b>status</b>: final</p><p><b>code</b>: Glucose [Moles/volume] in Blood <span>(Details : {LOINC code '15074-8' = 'Glucose [Moles/volume] in Blood', given as 'Glucose [Moles/volume] in Blood'})</span></p><p><b>subject</b>: <a>P. van de Heuvel</a></p><p><b>effective</b>: 02/04/2013 9:30:10 AM --&gt; (ongoing)</p><p><b>issued</b>: 03/04/2013 3:30:10 PM</p><p><b>performer</b>: <a>A. Langeveld</a></p><p><b>value</b>: 6.3 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></p><p><b>interpretation</b>: High <span>(Details : {http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation code 'H' = 'High', given as 'High'})</span></p><h3>ReferenceRanges</h3><table><tr><td>-</td><td><b>Low</b></td><td><b>High</b></td></tr><tr><td>*</td><td>3.1 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></td><td>6.2 mmol/l<span> (Details: UCUM code mmol/L = 'mmol/L')</span></td></tr></table></div>",
    status: "generated",
  },
  issued: "2013-04-03T15:30:10+01:00",
  status: "final",
  identifier: [
    {
      use: "official",
      value: "6323",
      system: "http://www.bmc.nl/zorgportal/identifiers/observations",
    },
  ],
  resourceType: "Observation",
  valueQuantity: {
    code: "mmol/L",
    unit: "mmol/l",
    value: 6.3,
    system: "http://unitsofmeasure.org",
  },
  interpretation: [
    {
      coding: [
        {
          code: "H",
          system:
            "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          display: "High",
        },
      ],
    },
  ],
  referenceRange: [
    {
      low: {
        code: "mmol/L",
        unit: "mmol/l",
        value: 3.1,
        system: "http://unitsofmeasure.org",
      },
      high: {
        code: "mmol/L",
        unit: "mmol/l",
        value: 6.2,
        system: "http://unitsofmeasure.org",
      },
    },
  ],
  effectivePeriod: {
    end: "2023-04-02T09:30:10+01:00",
    start: "2013-04-02T09:30:10+01:00",
  },
} as Observation;

const SEED_URL = "http://seed-id";

async function createTestData(seed: number) {
  const resources: Array<Resource> = [];
  const ext = [
    {
      url: SEED_URL,
      valueInteger: seed,
    },
  ];
  const practitionerResponse = await client.create(
    {},
    {
      ...practitioner,
      name: [
        {
          given: [`Adam${seed}`],
        },
      ],
    },
  );
  resources.push(practitionerResponse);

  const patientResponse = await client.create({}, {
    ...patient,
    extension: ext,
    generalPractitioner: [
      { reference: `Practitioner/${practitionerResponse.id}` },
    ],
  } as Patient);
  resources.push(patientResponse);

  const observationResponse = await client.create({}, {
    ...observation,
    extension: ext,
    subject: { reference: `Patient/${patientResponse.id}` },
  } as Observation);
  resources.push(observationResponse);

  return resources;
}

test("Parameter chains", async () => {
  try {
    const resources = (await createTestData(1)).concat(await createTestData(2));
    try {
      const observationSearch = await client.search_type({}, "Observation", [
        {
          name: "patient",
          chains: ["general-practitioner", "name"],
          value: [`Adam1`],
        },
      ]);

      //and $this.extension.where(url=%seedUrl).value = '1'
      const expectedResult = evaluate(
        "$this.where(resourceType='Observation' and $this.extension.where(url=%seedUrl).value = 1)",
        resources,
        {
          variables: {
            seedUrl: SEED_URL,
          },
        },
      );

      expect(observationSearch.resources).toEqual(expectedResult);
    } finally {
      await Promise.all(
        resources.map(async ({ resourceType, id }) => {
          return await client.delete({}, resourceType, id as id);
        }),
      );
    }
  } catch (e) {
    if (e instanceof OperationError) {
      e.operationOutcome &&
        console.log(JSON.stringify(e.operationOutcome, null, 2));
    }
    throw e;
  }
});

test("test offsets and count", async () => {
  const resources: Resource[] = [];
  try {
    for (let i = 0; i < 10; i++) {
      const observationResponse = await client.create({}, {
        ...observation,
        code: {
          coding: [
            {
              code: "test",
              system: "http://test.com",
            },
          ],
        },
      } as Observation);
      resources.push(observationResponse);
    }

    const observationSearch1 = await client.search_type({}, "Observation", [
      { name: "code", value: ["test"] },
      { name: "_count", value: [5] },
    ]);
    expect(observationSearch1.resources.length).toEqual(5);
    const observationSearch2 = await client.search_type({}, "Observation", [
      { name: "code", value: ["test"] },
      { name: "_count", value: [3] },
      { name: "_offset", value: [1] },
    ]);
    expect(observationSearch1.resources[1].id).toEqual(
      observationSearch2.resources[0].id,
    );
    expect(observationSearch2.resources.length).toEqual(3);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});

test("test total accurate", async () => {
  const resources: Resource[] = [];
  try {
    for (let i = 0; i < 10; i++) {
      const observationResponse = await client.create({}, {
        ...observation,
        code: {
          coding: [
            {
              code: "test",
              system: "http://test.com",
            },
          ],
        },
      } as Observation);
      resources.push(observationResponse);
    }

    const observationSearch1 = await client.search_type({}, "Observation", [
      { name: "code", value: ["test"] },
      { name: "_count", value: [5] },
      { name: "_total", value: ["accurate"] },
    ]);
    expect(observationSearch1.total).toEqual(10);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});

test("Test sort ", async () => {
  const resources: Resource[] = [];
  try {
    for (let i = 0; i < 10; i++) {
      const patientResponse = await client.create({}, {
        resourceType: "Patient",
        name: [
          {
            given: [String.fromCharCode(65 + i)],
            family: String.fromCharCode(65 + i),
          },
        ],
      } as Patient);
      const patientResponse2 = await client.create({}, {
        resourceType: "Patient",
        name: [
          {
            given: [String.fromCharCode(65 + i)],
            family: String.fromCharCode(65 + i + 1),
          },
        ],
      } as Patient);
      resources.push(patientResponse);
      resources.push(patientResponse2);
    }

    const patientSearch = await client.search_type({}, "Patient", [
      { name: "_sort", value: ["name"] },
    ]);

    expect(
      patientSearch.resources.map((v) => evaluate("$this.name.given", v)[0])[0],
    ).toEqual("A");

    const patientSearch2 = await client.search_type({}, "Patient", [
      { name: "_sort", value: ["-name"] },
    ]);

    expect(
      patientSearch2.resources.map(
        (v) => evaluate("$this.name.given", v)[0],
      )[0],
    ).toEqual("J");

    const mutliSort1 = await client.search_type({}, "Patient", [
      { name: "_sort", value: ["-name", "-family"] },
    ]);

    const resmultiSort1 = mutliSort1.resources.map(
      (v) => evaluate("$this.name.family", v)[0],
    );

    expect([resmultiSort1[0], resmultiSort1[1]]).toEqual(["K", "J"]);

    const mutliSort2 = await client.search_type({}, "Patient", [
      { name: "_sort", value: ["name", "-family"] },
    ]);

    const resmutliSort2 = mutliSort2.resources.map((v) => [
      evaluate("$this.name.given", v)[0],
      evaluate("$this.name.family", v)[0],
    ]);

    expect(resmutliSort2).toEqual([
      ["A", "B"],
      ["A", "A"],
      ["B", "C"],
      ["B", "B"],
      ["C", "D"],
      ["C", "C"],
      ["D", "E"],
      ["D", "D"],
      ["E", "F"],
      ["E", "E"],
      ["F", "G"],
      ["F", "F"],
      ["G", "H"],
      ["G", "G"],
      ["H", "I"],
      ["H", "H"],
      ["I", "J"],
      ["I", "I"],
      ["J", "K"],
      ["J", "J"],
    ]);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});

test("Testing custom extension added to resources", async () => {
  const resources: Resource[] = [];
  try {
    const p1 = await client.create({}, {
      resourceType: "Patient",
    } as Patient);
    resources.push(p1);
    expect(evaluate("$this.meta.extension.url", p1).sort()).toEqual(
      [
        "https://iguhealth.app/version-sequence",
        "https://iguhealth.app/author",
      ].sort(),
    );
    const existingExtensions = await client.create({}, {
      meta: {
        extension: [
          { url: "https://iguhealth.app/author", valueString: "test" },
          {
            url: "https://iguhealth.app/version-sequence",
            valueInteger: 1,
          },
        ],
      },
      resourceType: "Patient",
    } as Patient);
    resources.push(existingExtensions);
    expect(
      evaluate("$this.meta.extension.url", existingExtensions).sort(),
    ).toEqual(
      [
        "https://iguhealth.app/version-sequence",
        "https://iguhealth.app/author",
      ].sort(),
    );

    const preserveExtensions = await client.create({}, {
      meta: {
        extension: [
          { url: "https://test.com", valueString: "test" },
          { url: "https://iguhealth.app/author", valueString: "test" },
          {
            url: "https://iguhealth.app/version-sequence",
            valueInteger: 1,
          },
        ],
      },
      resourceType: "Patient",
    } as Patient);
    resources.push(preserveExtensions);
    expect(
      evaluate("$this.meta.extension.url", preserveExtensions).sort(),
    ).toEqual(
      [
        "https://iguhealth.app/version-sequence",
        "https://iguhealth.app/author",
        "https://test.com",
      ].sort(),
    );
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});

test("Number range", async () => {
  const resources: Resource[] = [];
  try {
    const RiskAssessment: RiskAssessment = await client.create({}, {
      status: "final",
      subject: {
        reference: "Patient/b248b1b2-1686-4b94-9936-37d7a5f94b51",
      },
      prediction: [
        {
          probabilityDecimal: 1.1327,
        },
      ],
      resourceType: "RiskAssessment",
      occurrenceDateTime: "2006-01-13T23:01:00Z",
    } as RiskAssessment);
    resources.push(RiskAssessment);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: [1.133] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: [1.134] },
        ])
      ).resources.length,
    ).toEqual(0);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: [1.13] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: [1.14] },
        ])
      ).resources.length,
    ).toEqual(0);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});

test("Number prefixes", async () => {
  const resources: Resource[] = [];
  try {
    const RiskAssessment: RiskAssessment = await client.create({}, {
      status: "final",
      subject: {
        reference: "Patient/b248b1b2-1686-4b94-9936-37d7a5f94b51",
      },
      prediction: [
        {
          probabilityDecimal: 1.1327,
        },
      ],
      resourceType: "RiskAssessment",
      occurrenceDateTime: "2006-01-13T23:01:00Z",
    } as RiskAssessment);
    resources.push(RiskAssessment);

    // Because range is off it will not match on generic
    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["gt1"] },
        ])
      ).resources.length,
    ).toEqual(0);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["gt1.12"] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["gt1.13"] },
        ])
      ).resources.length,
    ).toEqual(0);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["ge1.13"] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["gt-1"] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["lt1.14"] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["lt1.133"] },
        ])
      ).resources.length,
    ).toEqual(0);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["le1.133"] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["lt1.130"] },
        ])
      ).resources.length,
    ).toEqual(0);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["ne1.13"] },
        ])
      ).resources.length,
    ).toEqual(0);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["eq1.13"] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);

    expect(
      (
        await client.search_type({}, "RiskAssessment", [
          { name: "probability", value: ["1.13"] },
        ])
      ).resources[0].id,
    ).toEqual(RiskAssessment.id);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
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
    const q = await client.create({}, questionnaireTemplate);
    resources.push(q);
    const qr = await client.create({}, qrTemplate);
    resources.push(qr);

    expect(
      await client.search_type({}, "QuestionnaireResponse", [
        { name: "questionnaire", value: [q.id as id] },
      ]),
    ).toEqual({
      resources: [qr],
    });

    expect(
      await client.search_type({}, "QuestionnaireResponse", [
        { name: "questionnaire", value: [q.url as string] },
      ]),
    ).toEqual({
      resources: [qr],
    });

    expect(
      await client.search_type({}, "Questionnaire", [
        { name: "url", value: ["https://iguhealth.com/PREPARE"] },
      ]),
    ).toEqual({
      resources: [q],
    });
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});

test("Type filter Memory", async () => {
  expect([
    ...new Set(
      (
        await client.search_system({}, [
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
    const q = await client.create({}, questionnaireTemplate);
    resources.push(q);
    const qr = await client.create({}, qrTemplate);
    resources.push(qr);

    expect(
      await client.search_system({}, [
        { name: "_type", value: ["QuestionnaireResponse"] },
      ]),
    ).toEqual({
      resources: [qr],
    });

    expect(
      await client.search_system({}, [
        { name: "_type", value: ["Questionnaire"] },
      ]),
    ).toEqual({
      resources: [q],
    });
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});

test("Memory type test", async () => {
  const primitiveSDSearch = await client.search_type(
    {},
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
    const q = await client.create({}, questionnaireTemplate);
    resources.push(q);
    const q2 = await client.create(
      {},
      { ...questionnaireTemplate, title: "test&encoding=3" },
    );
    resources.push(q2);

    expect(
      await client.search_type({}, "Questionnaire", [
        { name: "title", value: ["test/encoding=123"] },
      ]),
    ).toEqual({
      resources: [q],
    });

    expect(
      await client.search_type({}, "Questionnaire", [
        { name: "title", value: ["test&encoding=3"] },
      ]),
    ).toEqual({
      resources: [q2],
    });
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as id);
      }),
    );
  }
});
