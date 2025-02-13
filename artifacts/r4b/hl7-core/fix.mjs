import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PATH = path.join(
  fileURLToPath(import.meta.url),
  "../definitions/valuesets.json",
);

const content = JSON.parse(fs.readFileSync(PATH, { encoding: "utf8" }));

function shouldAddPublisher(e) {
  return (
    e.resource.resourceType === "CodeSystem" &&
    e.resource.publisher === undefined &&
    e.resource.meta.profile?.includes(
      "http://hl7.org/fhir/StructureDefinition/shareablecodesystem",
    )
  );
}

content.entry = content.entry.map((e) =>
  shouldAddPublisher(e)
    ? { ...e, resource: { ...e.resource, publisher: "HL7 FHIR" } }
    : e,
);

fs.writeFileSync(PATH, JSON.stringify(content, null, 2));
