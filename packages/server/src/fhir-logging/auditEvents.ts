import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  AuditEvent,
  Reference,
  code,
  instant,
  uri,
} from "@iguhealth/fhir-types/r4/types";

import { FHIRServerCTX } from "../fhir-context/context.js";

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

export default async function logAuditEvent<
  CTX extends FHIRServerCTX,
  Client extends FHIRClientAsync<CTX>,
>(
  client: Client,
  ctx: CTX,
  outcome: OUTCOMES[keyof OUTCOMES],
  entity: Reference,
  outcomeDescription: string,
) {
  const auditEvent: AuditEvent = {
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
        altId: ctx.user.jwt.sub,
        name: ctx.user.jwt.sub,
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

  const savedAuditEvent = await client.create(ctx, auditEvent);
  return savedAuditEvent;
}
