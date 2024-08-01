import * as s from "zapatos/schema";

import {
  Membership,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

export function userToMembership(
  user: Partial<s.users.JSONSelectable> & { email: string },
): Membership {
  const member: Membership = {
    resourceType: "Membership",
    emailVerified: user.email_verified ? user.email_verified : false,
    email: user.email,
    name: {
      given: user.first_name ? [user.first_name] : [],
      family: user.last_name ?? "",
    },
    role: (user.role ? user.role : "member") as code,
  };

  if (user.id) {
    member.id = user.id as id;
  }

  return member;
}

export function membershipToUser(user: Membership): s.users.Insertable {
  const fhir_user_id = user.id;
  const fhir_user_versionid = user.meta?.versionId;

  console.log(user);

  if (!fhir_user_id) {
    throw new OperationError(outcomeFatal("exception", "User id not found"));
  }
  if (!fhir_user_versionid) {
    throw new OperationError(
      outcomeFatal("exception", "User versionId not found"),
    );
  }

  return {
    email: user.email,
    first_name: user.name?.given?.[0] ?? null,
    last_name: user.name?.family ?? null,
    role: user.role as s.user_role,
    fhir_user_versionid: parseInt(fhir_user_versionid),
    fhir_user_id,
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
