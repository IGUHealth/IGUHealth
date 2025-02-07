import { uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";
import analyze from "@iguhealth/fhirpath/analyze";

type SP1_URIS = Set<uri>;

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

      const types = v.types();
      if (!types) {
        return "unknown";
      }
      for (const meta of types) {
        switch (meta.type) {
          case "http://hl7.org/fhirpath/System.String":
          case "markdown":
          case "string":
          case "code":
          case "boolean":
          case "id":
          case "uri":
          case "url":
          case "uuid":
          case "canonical":
          case "decimal":
          case "integer":
          case "instant":
          case "date":
          case "dateTime":
          case "Identifier":
          case "ContactPoint":
          case "Reference":
          case "Coding":
          case "Period":
          case "Range":
          case "Age":
          case "Money":
          case "Duration":
          case "Quantity": {
            break;
          }
          case "CodeableReference":
          case "HumanName":
          case "Address":
          case "CodeableConcept":
          case "Timing": {
            return "array";
          }
          // [TODO] These are invalid should not be indexed appears standard does not account for them though.
          case "SampledData":
          case undefined: {
            return "unknown";
          }
          default: {
            throw new Error(
              `Unsupported type for:'${meta.type}' expression:'${searchParameter.expression}'`,
            );
          }
        }
      }
    }
  }

  return "single";
}

/**
 * We can do optimizations for single value parameters. This function generates a set of search parameters that evaluate to a single value.
 * @param version The FHIR version
 * @param searchParameters Search parameters to filter for parameters that evaluate to a single value.
 * @returns Filters Search parameters for parameters that evaluate to a single value.
 */
export const generateSP1Sets = async <Version extends FHIR_VERSION>(
  version: Version,
  searchParameters: Resource<Version, "SearchParameter">[],
) => {
  const res: SP1_URIS = new Set();

  const filteredParameters = searchParameters.filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  for (const parameter of filteredParameters) {
    switch (parameter.type) {
      // Skipping references as singular for now.
      case "reference": {
        break;
      }
      default: {
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
    }
  }
  return res;
};
