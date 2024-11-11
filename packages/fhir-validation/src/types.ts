import { Loc } from "@iguhealth/fhir-pointer";
import {
  canonical,
  ElementDefinition,
  StructureDefinition,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

type IsTemplateKey<Pattern, T> = T extends Pattern ? T : never;

type TemplateKeys<Pattern, T> = IsTemplateKey<Pattern, keyof T>;

type TypesByTemplate<Pattern, T> = Pick<T, TemplateKeys<Pattern, T>>[keyof Pick<
  T,
  TemplateKeys<Pattern, T>
>];

type ElementDefinitionPatternTypes = TypesByTemplate<
  `pattern${string}`,
  ElementDefinition
>;

export type ElementLoc = Loc<
  StructureDefinition | r4b.StructureDefinition,
  ElementDefinition | r4b.ElementDefinition | undefined,
  Loc<
    StructureDefinition | r4b.StructureDefinition,
    r4b.ElementDefinition[] | ElementDefinition[]
  >
>;

export interface ValidationCTX {
  fhirVersion: FHIR_VERSION;
  resolveTypeToCanonical<Version extends FHIR_VERSION>(
    version: Version,
    type: uri,
  ): Promise<canonical | undefined>;
  resolveCanonical: <
    FHIRVersion extends FHIR_VERSION,
    Type extends ResourceType<FHIRVersion>,
  >(
    fhirVersion: FHIRVersion,
    type: Type,
    url: canonical,
  ) => Promise<Resource<FHIRVersion, Type> | undefined>;
  validateCode?(system: string, code: string): Promise<boolean>;
}
