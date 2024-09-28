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
    id: user.fhir_user_id as id,
    resourceType: "Membership",
    emailVerified: user.email_verified ? user.email_verified : false,
    email: user.email,
    name: {
      given: user.first_name ? [user.first_name] : [],
      family: user.last_name ?? "",
    },
    role: (user.role ? user.role : "member") as code,
  };

  return member;
}

export function membershipToUser(user: Membership): s.users.Insertable {
  const fhir_user_id = user.id;
  const fhir_user_versionid = user.meta?.versionId;

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
    method: user.federated?.reference?.split("/")[1]
      ? "oidc-provider"
      : "email-password",
    first_name: user.name?.given?.[0] ?? null,
    last_name: user.name?.family ?? null,
    role: user.role as s.user_role,
    fhir_user_versionid: parseInt(fhir_user_versionid),
    fhir_user_id,
    fhir_provider_id: user.federated?.reference?.split("/")[1] ?? null,
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
  update: Pick<s.users.Updatable, "email" | "email_verified">,
  current: s.users.JSONSelectable | undefined,
): s.users.Updatable["email_verified"] {
  // If email has changed.
  if (!current) return false;
  if (update.email !== current.email) return false;
  if ("email_verified" in update) return update.email_verified;

  return current.email_verified;
}
