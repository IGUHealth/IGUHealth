import { FHIR_VERSIONS_SUPPORTED } from "@iguhealth/fhir-types/versions";

export type RequestLevel = {
  instance: "instance";
  system: "system";
  type: "type";
};

export type Interaction =
  | "read"
  | "vread"
  | "update"
  | "patch"
  | "delete"
  | "history"
  | "create"
  | "search"
  | "capabilities"
  | "batch"
  | "transaction"
  | "invoke";

export type RequestType = { [I in Interaction]: `${I}-request` };

export type ResponseType = {
  [I in Interaction]: `${I}-response`;
} & { error: "error-response" };

export function RequestType(
  interaction: Interaction,
): RequestType[keyof RequestType] {
  return `${interaction}-request`;
}

export function ResponseType(
  interaction: Interaction | "error",
): ResponseType[keyof ResponseType] {
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
