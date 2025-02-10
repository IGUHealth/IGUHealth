import { canonical, code } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

type SearchParameterCanonicalHash = {
  [n in FHIR_VERSION]: Partial<
    Record<ResourceType<n>, Record<code, canonical>>
  >;
};

export async function createHash<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  parameters: Resource<Version, "SearchParameter">[],
  startingHash?: SearchParameterCanonicalHash,
): Promise<SearchParameterCanonicalHash> {
  const hash: SearchParameterCanonicalHash = {
    [R4]: {},
    [R4B]: {},
    ...startingHash,
  };

  for (const parameter of parameters) {
    for (const base of parameter.base) {
      hash[fhirVersion][base as ResourceType<typeof fhirVersion>] = {
        ...hash[fhirVersion][base as ResourceType<typeof fhirVersion>],
        [parameter.code]: parameter.url,
      };
    }
  }

  return hash;
}
