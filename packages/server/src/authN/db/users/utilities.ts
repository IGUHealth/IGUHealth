import * as s from "zapatos/schema";

import {
  Membership,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";

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
    role: user.role as s.user_role,
    fhir_user_versionid: user.meta?.versionId
      ? parseInt(user.meta.versionId)
      : null,
    fhir_user_id: user.id,
  };
}

/**
 * Return false if email changed (even if update specifies the email is verified)
 * Return value of update for email_verified if present in update.
 * Else default to current email_verified value.
 * @param update Update to user table
 * @param current Current value in user table
 * @returns whether email is verified.
 */
export function determineEmailUpdate(
  update: s.users.Updatable,
  current: s.users.JSONSelectable,
): s.users.Updatable["email_verified"] {
  // If email has changed.
  if (update.email && update.email !== current.email) return false;
  if ("email_verified" in update) return update.email_verified;

  return current.email_verified;
}
