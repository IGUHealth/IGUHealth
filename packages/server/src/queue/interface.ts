import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

export type Interaction = "create" | "update" | "delete";

export interface Message {
  id?: number;
  fhir_version: FHIR_VERSION;
  topic_id: string;
  resource_id: string;
  resource_version_id: number;
  interaction: Interaction;
}

export interface Queue {
  send(tenant: TenantId, message: Message[]): Promise<Message[]>;
}
