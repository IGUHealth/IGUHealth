import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
} from "@iguhealth/fhir-types/versions";
import analyze from "@iguhealth/fhirpath/analyze";

function generateTypeSet(name: string, sds: Readonly<Set<string>>) {
  return `export const ${name}: Set<string>  = new Set([${[...sds]
    .map((uri) => `\n  "${uri}",`)
    .join("")}\n])\n`;
}

function parameterName(version: FHIR_VERSION) {
  switch (version) {
    case R4: {
      return "r4_sp1_parameters";
    }
    case R4B: {
      return "r4b_sp1_parameters";
    }
    default: {
      throw new Error(`Unsupported FHIR version: ${version}`);
    }
  }
}

type SP1_Tables = Set<uri>;

async function getParameterCardinality<Version extends FHIR_VERSION>(
  version: Version,
  searchParameter: Resource<Version, "SearchParameter">,
): Promise<"unknown" | "single" | "array"> {
  for (const base of searchParameter.base) {
    const evalResult = await analyze(
      version,
      base as unknown as uri,
      searchParameter.expression as string,
    );

    if (evalResult.length === 0) {
      return "unknown";
    }

    for (const v of evalResult) {
      const cardinality = "cardinality" in v ? v.cardinality() : "unknown";
      if (cardinality === "array" || cardinality === "unknown") {
        return cardinality;
      }
    }
  }

  return "single";
}

async function generateSP1MetaSets<Version extends FHIR_VERSION>(
  version: Version,
  searchParameters: Resource<Version, "SearchParameter">[],
): Promise<Readonly<SP1_Tables>> {
  const res: SP1_Tables = new Set();
  for (const parameter of searchParameters) {
    const cardinality = await getParameterCardinality(version, parameter);
    switch (cardinality) {
      case "unknown":
      case "array": {
        break;
      }
      case "single": {
        res.add(parameter.url);
        break;
      }
      default: {
        throw new Error(`Unsupported cardinality: ${cardinality}`);
      }
    }
  }
  return res;
}

export async function generateSP1MetaInformationCode<
  Version extends FHIR_VERSION,
>(
  version: Version,
  searchParameterUrls: Readonly<Set<string>>,
): Promise<string> {
  const name = parameterName(version);
  return generateTypeSet(name, searchParameterUrls);
}

export async function generateSP1Table<Version extends FHIR_VERSION>(
  version: Version,
  sp1Urls: Readonly<Set<string>>,
  searchParameters: Resource<Version, "SearchParameter">[],
): Promise<string> {
  const parameterHash = searchParameters.reduce(
    (acc: Record<string, Resource<Version, "SearchParameter">>, parameter) => {
      acc[parameter.url] = parameter;
      return acc;
    },
    {},
  );

  let sql = `CREATE TABLE IF NOT EXISTS ${parameterName(version)} ();\n`;
  for (const sp1Url of sp1Urls) {
    const parameter = parameterHash[sp1Url];
    switch (parameter.type) {
      case "number":
      case "date":
      case "string":
      case "token":
      case "reference":
      case "quantity":
      case "uri":

      case "composite":
      case "special":
      default: {
        throw new Error();
      }
    }
  }

  return sql;
}

export const generateSP1Sets = async <Version extends FHIR_VERSION>(
  version: Version,
  searchParameters: Resource<Version, "SearchParameter">[],
) => {
  const set = await generateSP1MetaSets(version, searchParameters);
  return set;
};
