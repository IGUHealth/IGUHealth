import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  ConceptMap,
  Patient,
  Practitioner,
  StructureDefinition,
  canonical,
  uri,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
} from "@iguhealth/fhir-types/lib/versions";

import { flatten } from "../utilities.js";
import { PartialMeta, descend, metaValue } from "./index";

const sds: StructureDefinition[] = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
});

async function resolveTypeToCanonical(
  _fhirVersion: FHIR_VERSION,
  type: uri,
): Promise<canonical | undefined> {
  const foundSD = sds.find((sd) => sd.type === type);
  return foundSD?.url as canonical;
}

async function resolveCanonical<
  Version extends FHIR_VERSION,
  Type extends AllResourceTypes,
>(
  fhirVersion: Version,
  type: Type,
  url: canonical,
): Promise<Resource<Version, Type> | undefined> {
  const foundSD = sds.find((sd) => sd.url === url);
  return foundSD as Resource<Version, Type> | undefined;
}

function meta(version: FHIR_VERSION, type: uri): PartialMeta {
  return {
    type: {
      fhirVersion: version,
      type,
      resolveTypeToCanonical,
      resolveCanonical,
    },
  };
}

test("Untyped", async () => {
  const patient: Patient = {
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob"] }],
    deceasedBoolean: true,
  } as Patient;
  const myValue = await metaValue({}, patient);
  if (!myValue) throw new Error();
  expect((await descend(flatten(myValue)[0], "name"))?.getValue()).toEqual([
    { given: ["bob"] },
  ]);
  expect((await descend(flatten(myValue)[0], "deceased"))?.getValue()).toEqual(
    true,
  );
  expect(
    (await descend(flatten(myValue)[0], "identifier"))?.getValue(),
  ).toEqual([{ system: "mrn", value: "123" }]);
  expect(
    (await descend(flatten(myValue)[0], "nonExistent"))?.getValue(),
  ).toEqual(undefined);
});

test("Simple Type test", async () => {
  const patient: Patient = {
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob"] }],
    deceasedBoolean: true,
  } as Patient;
  const myValue = flatten(
    await metaValue(meta(R4, "Patient" as uri), patient),
  )[0];

  expect((await descend(myValue, "name"))?.getValue()).toEqual([
    { given: ["bob"] },
  ]);
  expect((await descend(myValue, "name"))?.meta()?.type).toEqual("HumanName");
  expect((await descend(myValue, "identifier"))?.meta()?.type).toEqual(
    "Identifier",
  );
  expect((await descend(myValue, "id"))?.meta()?.type).toEqual(
    "http://hl7.org/fhirpath/System.String",
  );
  expect((await descend(myValue, "deceased"))?.getValue()).toEqual(true);
  expect((await descend(myValue, "deceased"))?.meta()?.type).toEqual("boolean");

  let output: (string | undefined)[] = [];
  const v = await descend(myValue, "identifier");
  if (v && v.isArray()) {
    output = await Promise.all(
      v.toArray().map(async (v) => (await descend(v, "system"))?.meta()?.type),
    );
  }
  expect(output).toEqual(["uri"]);
});

test("ConceptMap test", async () => {
  const cm: ConceptMap = {
    resourceType: "ConceptMap",
    status: "final",
    group: [
      {
        unmapped: {
          mode: "other-map",
          url: "test",
        },
        element: [
          {
            target: [
              {
                equivalence: "equal",
                dependsOn: [
                  { property: "system", value: "http://snomed.info/sct" },
                ],
                product: [
                  {
                    property: "code",
                    system: "http://snomed.info/sct",
                    value: "123",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  } as ConceptMap;
  const myValue = flatten(
    await metaValue(meta(R4, "ConceptMap" as uri), cm),
  )[0];

  //ConceptMap.group.element.target.product.property
  let cur = flatten(await descend(myValue, "group"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(await descend(cur, "element"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(await descend(cur, "target"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(await descend(cur, "product"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(await descend(cur, "property"))[0];
  expect(cur?.meta()?.type).toEqual("uri");

  // Test unmapped
  cur = flatten(await descend(myValue, "group"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(await descend(cur, "unmapped"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(await descend(cur, "url"))[0];
  expect(cur?.meta()?.type).toEqual("canonical");
});

test("Location test", async () => {
  const patient: Patient = {
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob", "frank"] }],
    deceasedBoolean: true,
  } as Patient;
  const myValue = flatten(
    await metaValue(meta(R4, "Patient" as uri), patient),
  )[0];
  let cur = flatten(await descend(myValue, "name"));
  cur = flatten(await descend(cur[0], "given"));
  expect(cur.map((v) => v.location())).toEqual([
    ["name", 0, "given", 0],
    ["name", 0, "given", 1],
  ]);

  cur = flatten(await descend(myValue, "identifier"));
  cur = flatten(await descend(cur[0], "system"));
  expect(cur[0].location()).toEqual(["identifier", 0, "system"]);
});

test("typechoice", async () => {
  const practitioner: Practitioner = {
    extension: [{ url: "test", valueReference: { reference: "urn:oid:2" } }],
    resourceType: "Practitioner",
    name: [{ given: ["Bob"] }],
  } as Practitioner;
  const myValue = flatten(
    await metaValue(meta(R4, "Practitioner" as uri), practitioner),
  )[0];

  let cur = flatten(await descend(myValue, "extension"));
  cur = flatten(await descend(cur[0], "value"));

  expect(cur[0].meta()?.type).toEqual("Reference");

  cur = flatten(await descend(myValue, "extension"));
  cur = flatten(await descend(cur[0], "valueReference"));
  expect(cur[0].meta()?.type).toEqual("Reference");
});

function getValue(loc: (string | number)[] = [], obj: any) {
  let cur: any = obj;
  for (const l of loc) {
    cur = cur[l];
  }
  return cur;
}

test("Location test primitive extensions", async () => {
  const patient = flatten(
    await metaValue(meta(R4, "Practitioner" as uri), {
      id: "123",
      resourceType: "Patient",
      identifier: [{ system: "mrn", value: "123" }],
      deceasedBoolean: true,
      name: [
        {
          given: ["Bob"],
          _given: [
            { extension: [{ url: "https://given.com", valueString: "given" }] },
          ],
        },
      ],
      _deceasedBoolean: {
        extension: [{ url: "https://test.com", valueString: "boolean" }],
      },
    }),
  )[0];

  let cur = flatten(await descend(patient, "deceased"));
  cur = flatten(await descend(cur[0], "extension"));
  cur = flatten(await descend(cur[0], "value"));
  expect(cur[0].location()).toEqual([
    "_deceasedBoolean",
    "extension",
    0,
    "valueString",
  ]);
  expect(cur[0].getValue()).toEqual("boolean");
  expect(getValue(cur[0].location(), patient.getValue())).toEqual("boolean");

  cur = flatten(await descend(patient, "name"));
  cur = flatten(await descend(cur[0], "given"));
  cur = flatten(await descend(cur[0], "extension"));
  cur = flatten(await descend(cur[0], "value"));

  expect(cur[0].location()).toEqual([
    "name",
    0,
    "_given",
    0,
    "extension",
    0,
    "valueString",
  ]);
  expect(cur[0].getValue()).toEqual("given");
  expect(getValue(cur[0].location(), patient.getValue())).toEqual("given");
});
