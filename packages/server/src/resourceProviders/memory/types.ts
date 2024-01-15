import { AResource, ResourceType, id } from "@iguhealth/fhir-types/r4/types";

export type InternalData<T extends ResourceType> = Partial<
  Record<T, Record<id, AResource<T> | undefined>>
>;
