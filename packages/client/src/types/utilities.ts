import { FHIR_VERSIONS_SUPPORTED } from "@iguhealth/fhir-types/versions";

export type RequestLevel = {
  instance: "instance";
  system: "system";
  type: "type";
};

export type Interaction = {
  read: "read";
  vread: "vread";
  update: "update";
  patch: "patch";
  delete: "delete";
  history: "history";
  create: "create";
  search: "search";
  capabilities: "capabilities";
  batch: "batch";
  transaction: "transaction";
  invoke: "invoke";
};

export type AllInteractions = Interaction[keyof Interaction];

export type RequestType = {
  [I in Interaction[keyof Interaction]]: `${I}-request`;
};

export type ResponseType = {
  [I in Interaction[keyof Interaction]]: `${I}-response`;
} & { error: "error-response" };

export function RequestType(
  interaction: Interaction[keyof Interaction],
): RequestType[AllInteractions] {
  return `${interaction}-request`;
}

export function ResponseType(
  interaction: Interaction[keyof Interaction] | "error",
): ResponseType[AllInteractions | "error"] {
  return `${interaction}-response`;
}

export type Request<
  Version extends (typeof FHIR_VERSIONS_SUPPORTED)[number],
  level extends keyof RequestLevel,
> = {
  fhirVersion: Version;
  level: RequestLevel[level];
  http?: {
    status: number;
    headers: Record<string, string>;
  };
};
