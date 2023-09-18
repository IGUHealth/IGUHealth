import { AuditEvent, Reference } from "@iguhealth/fhir-types/r4/types";

import { FHIRServerCTX } from "../fhirServer.js";

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

export default async function logAuditEvent(
  ctx: FHIRServerCTX,
  outcome: OUTCOMES[keyof OUTCOMES],
  entity: Reference,
  outcomeDescription: string
) {
  ctx.author;
  const auditEvent: AuditEvent = {
    resourceType: "AuditEvent",
    type: {
      system: "http://hl7.org/fhir/ValueSet/audit-event-type",
      code: "rest",
    },
    recorded: new Date().toISOString(),
    outcome: outcome,
    outcomeDesc: outcomeDescription,
    agent: [
      {
        altId: ctx.author,
        name: ctx.author,
        requestor: true,
      },
    ],
    source: {
      observer: {
        identifier: {
          system: "https://iguhealth.com",
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

  const savedAuditEvent = await ctx.client.create(ctx, auditEvent);
  return savedAuditEvent;
}
