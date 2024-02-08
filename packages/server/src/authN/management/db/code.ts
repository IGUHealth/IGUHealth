import type * as Koa from "koa";
import { randomBytes } from "node:crypto";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { KoaFHIRServicesContext } from "../../../fhir-context/koa.js";

export async function createAuthorizationCode(
  ctx: KoaFHIRServicesContext<Koa.DefaultContext>,
  email: string,
): Promise<s.authorization_code.JSONSelectable> {
  const codeToInsert: s.authorization_code.Insertable = {
    user_id: email,
    type: "signup_confirmation",
    code: randomBytes(32).toString("hex"),
    // 15 minutes
    duration_valid_seconds: "15 minutes",
  };

  const code = await db
    .insert("authorization_code", codeToInsert)
    .run(ctx.postgres);

  return code;
}
