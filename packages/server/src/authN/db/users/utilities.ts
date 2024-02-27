import * as s from "zapatos/schema";

import { Membership, code, id } from "@iguhealth/fhir-types/lib/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export function userToMembership(user: s.users.JSONSelectable): Membership {
  return {
    resourceType: "Membership",
    emailVerified: user.email_verified ? user.email_verified : false,
    id: user.id as id,
    email: user.email,
    name: {
      given: user.first_name ? [user.first_name] : [],
      family: user.last_name ? user.last_name : undefined,
    },
    role: (user.role ? user.role : "member") as code,
  };
}

export function membershipToUser(user: Membership): s.users.Insertable {
  return {
    email: user.email,
    first_name: user.name?.given?.[0] ?? null,
    last_name: user.name?.family ?? null,
    email_verified: user.emailVerified,
    role: "member",
    fhir_user_versionid: user.meta?.versionId
      ? parseInt(user.meta.versionId)
      : null,
  };
}
