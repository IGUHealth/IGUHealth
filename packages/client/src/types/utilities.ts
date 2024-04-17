import { FHIR_VERSIONS_SUPPORTED } from "../version.js";

type RequestLevel = {
  instance: "instance";
  system: "system";
  type: "type";
};

export type RequestInteractionTypes = {
  read: "read-request";
  vread: "vread-request";
  update: "update-request";
  patch: "patch-request";
  delete: "delete-request";
  history: "history-request";
  create: "create-request";
  search: "search-request";
  capabilities: "capabilities-request";
  batch: "batch-request";
  transaction: "transaction-request";
  invoke: "invoke-request";
};

export type ResponseInteractionTypes = {
  read: "read-response";
  vread: "vread-response";
  update: "update-response";
  patch: "patch-response";
  delete: "delete-response";
  history: "history-response";
  create: "create-response";
  search: "search-response";
  capabilities: "capabilities-response";
  batch: "batch-response";
  transaction: "transaction-response";
  invoke: "invoke-response";
};

export type Request<
  Version extends (typeof FHIR_VERSIONS_SUPPORTED)[number],
  level extends keyof RequestLevel,
> = {
  fhirVersion: Version;
  level: RequestLevel[level];
};
