import { expect, test, describe, afterEach, beforeEach } from "@jest/globals";
import {
  AResource,
  Observation,
  Patient,
  Practitioner,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types";

import HTTPClient from "@iguhealth/client/lib/http/index.js";
import { evaluate } from "@iguhealth/fhirpath";

const client = HTTPClient({
  url: "http://localhost:3000/w/1704fc63-dd53-4d6c-8435-1a4b83ba27f1/api/v1/fhir/r4",
  token: "blah",
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
};

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
      issuer: {
        display: "Example University",
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
};

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
};

const SEED_URL = "http://seed-id";

async function createTestData(seed: number) {
  let resources: Array<Resource> = [];
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
    }
  );
  resources.push(practitionerResponse);

  const patientResponse = await client.create(
    {},
    {
      ...patient,
      extension: ext,
      generalPractitioner: [
        { reference: `Practitioner/${practitionerResponse.id}` },
      ],
    }
  );
  resources.push(patientResponse);

  const observationResponse = await client.create(
    {},
    {
      ...observation,
      extension: ext,
      subject: { reference: `Patient/${patientResponse.id}` },
    }
  );
  resources.push(observationResponse);

  return resources;
}

test("Parameter chains", async () => {
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
      }
    );

    expect(observationSearch.resources).toEqual(expectedResult);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as string);
      })
    );
  }
});

test("test offsets and count", async () => {
  const resources: Resource[] = [];
  try {
    for (let i = 0; i < 10; i++) {
      const observationResponse = await client.create(
        {},
        {
          ...observation,
          code: {
            coding: [
              {
                code: "test",
                system: "http://test.com",
              },
            ],
          },
        }
      );
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
      observationSearch2.resources[0].id
    );
    expect(observationSearch2.resources.length).toEqual(3);
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as string);
      })
    );
  }
});

test("test total accurate", async () => {
  const resources: Resource[] = [];
  try {
    for (let i = 0; i < 10; i++) {
      const observationResponse = await client.create(
        {},
        {
          ...observation,
          code: {
            coding: [
              {
                code: "test",
                system: "http://test.com",
              },
            ],
          },
        }
      );
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
        return await client.delete({}, resourceType, id as string);
      })
    );
  }
});

test("Test sort ", async () => {
  const resources: Resource[] = [];
  try {
    for (let i = 0; i < 10; i++) {
      const patientResponse = await client.create(
        {},
        {
          resourceType: "Patient",
          name: [
            {
              given: [String.fromCharCode(65 + i)],
              family: String.fromCharCode(65 + i),
            },
          ],
        }
      );
      const patientResponse2 = await client.create(
        {},
        {
          resourceType: "Patient",
          name: [
            {
              given: [String.fromCharCode(65 + i)],
              family: String.fromCharCode(65 + i + 1),
            },
          ],
        }
      );
      resources.push(patientResponse);
      resources.push(patientResponse2);
    }

    const patientSearch = await client.search_type({}, "Patient", [
      { name: "_sort", value: ["name"] },
    ]);

    expect(
      patientSearch.resources.map((v) => evaluate("$this.name.given", v)[0])[0]
    ).toEqual("A");

    const patientSearch2 = await client.search_type({}, "Patient", [
      { name: "_sort", value: ["-name"] },
    ]);

    expect(
      patientSearch2.resources.map((v) => evaluate("$this.name.given", v)[0])[0]
    ).toEqual("J");

    const mutliSort1 = await client.search_type({}, "Patient", [
      { name: "_sort", value: ["-name", "-family"] },
    ]);

    const resmultiSort1 = mutliSort1.resources.map(
      (v) => evaluate("$this.name.family", v)[0]
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
        return await client.delete({}, resourceType, id as string);
      })
    );
  }
});

test("Testing custom extension added to resources", async () => {
  const resources: Resource[] = [];
  try {
    const p1 = await client.create(
      {},
      {
        resourceType: "Patient",
      }
    );
    resources.push(p1);
    expect(evaluate("$this.meta.extension.url", p1).sort()).toEqual(
      [
        "https://iguhealth.app/version-sequence",
        "https://iguhealth.app/author",
      ].sort()
    );
    const existingExtensions = await client.create(
      {},
      {
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
      }
    );
    resources.push(existingExtensions);
    expect(
      evaluate("$this.meta.extension.url", existingExtensions).sort()
    ).toEqual(
      [
        "https://iguhealth.app/version-sequence",
        "https://iguhealth.app/author",
      ].sort()
    );

    const preserveExtensions = await client.create(
      {},
      {
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
      }
    );
    resources.push(preserveExtensions);
    expect(
      evaluate("$this.meta.extension.url", preserveExtensions).sort()
    ).toEqual(
      [
        "https://iguhealth.app/version-sequence",
        "https://iguhealth.app/author",
        "https://test.com",
      ].sort()
    );
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, resourceType, id as string);
      })
    );
  }
});
