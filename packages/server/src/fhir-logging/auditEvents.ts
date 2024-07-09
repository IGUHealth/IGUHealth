import * as s from "zapatos/schema";

import { FHIRClientAsync } from "@iguhealth/client/interface";
import { Reference, code, instant, uri } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";
import { AccessTokenPayload } from "@iguhealth/jwt";

export type OUTCOMES = {
  SUCCESS: "0";
  MINOR_FAILURE: "4";
  SERIOUS_FAILURE: "8";
  MAJOR_FAILURE: "12";
};

export const SUCCESS: OUTCOMES["SUCCESS"] = "0";
export const MINOR_FAILURE: OUTCOMES["MINOR_FAILURE"] = "4";
export const SERIOUS_FAILURE: OUTCOMES["SERIOUS_FAILURE"] = "8";
export const MAJOR_FAILURE: OUTCOMES["MAJOR_FAILURE"] = "12";

export function createAuditEvent(
  user: AccessTokenPayload<s.user_role>,
  outcome: OUTCOMES[keyof OUTCOMES],
  entity: Reference,
  outcomeDescription: string,
): Resource<FHIR_VERSION, "AuditEvent"> {
  return {
    resourceType: "AuditEvent",
    type: {
      system: "http://hl7.org/fhir/ValueSet/audit-event-type" as uri,
      code: "rest" as code,
    },
    recorded: new Date().toISOString() as instant,
    outcome: outcome as code,
    outcomeDesc: outcomeDescription,
    agent: [
      {
        altId: user.sub,
        name: user.sub,
        requestor: true,
      },
    ],
    source: {
      observer: {
        identifier: {
          system: "https://iguhealth.com" as uri,
          value: "server",
        },
      },
    },
    entity: [
      {
        what: entity,
      },
    ],
  };
}

export default async function logAuditEvent<
  CTX,
  Version extends FHIR_VERSION,
  Client extends FHIRClientAsync<CTX>,
>(
  client: Client,
  ctx: CTX,
  fhirVersion: Version,
  auditEvent: Resource<Version, "AuditEvent">,
): Promise<Resource<Version, "AuditEvent">> {
  return client.create(ctx, fhirVersion, auditEvent);
}
