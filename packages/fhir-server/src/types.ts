import { id, Resource } from "@genfhi/fhir-types/r4/types";
import { FHIRURL } from "@genfhi/fhir-query";

export type InteractionLevel = {
  instance: "instance";
  system: "system";
  type: "type";
};

export type InstanceLevelInteraction = {
  level: InteractionLevel["instance"];
  type: "read" | "vread" | "update" | "patch" | "delete" | "history";
  resourceType: string;
  id: id;
};

export type TypeLevelInteractions = {
  level: InteractionLevel["type"];
  type: "create" | "search" | "delete" | "history";
  resourceType: string;
};

export type SystemInteraction = {
  level: InteractionLevel["system"];
  type:
    | "capabilities"
    | "batch"
    | "transaction"
    | "delete"
    | "history"
    | "search";
};

export type FHIRRequest = (
  | SystemInteraction
  | InstanceLevelInteraction
  | TypeLevelInteractions
) & { body?: Resource; url: FHIRURL };
