import { ResourceType, AResource, id } from "@iguhealth/fhir-types/r4/types";
import { FHIRServerCTX } from "../../ctx/types.js";

export type InternalData<T extends ResourceType> = Partial<
  Record<T, Record<id, AResource<T> | undefined>>
>;

export type AsyncMemoryCTX = FHIRServerCTX;
