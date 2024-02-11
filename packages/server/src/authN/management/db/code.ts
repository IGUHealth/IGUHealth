import { randomBytes } from "node:crypto";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export async function createAuthorizationCode(
  client: db.Queryable,
  type: s.code_type,
  email: string,
): Promise<s.authorization_code.JSONSelectable> {
  const codeToInsert: s.authorization_code.Insertable = {
    user_id: email,
    type,
    code: randomBytes(32).toString("hex"),
    // 15 minutes
    expires_in: "15 minutes",
  };

  const code = await db.insert("authorization_code", codeToInsert).run(client);

  return code;
}

export async function findAuthorizationCode(
  client: db.Queryable,
  type: s.code_type,
  passedCode: string,
): Promise<s.authorization_code.Selectable & { is_expired: boolean }> {
  const where: s.authorization_code.Whereable = {
    code: passedCode,
    type,
  };

  const foundCode = await db.sql<
    s.authorization_code.SQL,
    Array<
      (s.authorization_code.Selectable & { is_expired: boolean }) | undefined
    >
  >`SELECT *, NOW() > ${"created_at"} + ${"expires_in"} as is_expired FROM ${"authorization_code"} WHERE ${where}`.run(
    client,
  );

  // Sanity check should never happen given unique check on code.
  if (foundCode.length > 1) {
    throw new Error("Multiple codes found with the same code and type");
  }

  const code = foundCode[0];
  if (!code) {
    throw new OperationError(
      outcomeError("not-found", "Could not verify code."),
    );
  }

  return code;
}

export async function doesCodeAlreadyExistForUser(
  client: db.Queryable,
  email: string,
  type: s.code_type,
): Promise<boolean> {
  const where: s.authorization_code.Whereable = {
    user_id: email,
    type,
  };

  const activeCodes = await db.sql<
    s.authorization_code.SQL,
    s.authorization_code.Selectable[]
  >`SELECT * FROM ${"authorization_code"} WHERE ${where} AND NOW() < (${"created_at"} + ${"expires_in"})`.run(
    client,
  );

  return activeCodes.length > 0;
}
