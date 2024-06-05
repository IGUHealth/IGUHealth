import { customAlphabet } from "nanoid";
import React from "react";
import validator from "validator";
import * as db from "zapatos/db";

import { EmailForm, Feedback } from "@iguhealth/components";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asSystemCTX } from "../../../fhir-api/types.js";
import * as views from "../../../views/index.js";
import TenantAuthorizationCodeManagement from "../../db/code/provider/tenant.js";
import { USER_QUERY_COLS, User } from "../../db/users/types.js";
import { userToMembership } from "../../db/users/utilities.js";
import { sendAlertEmail } from "../../oidc/utilities/sendAlertEmail.js";
import { sendPasswordResetEmail } from "../../oidc/utilities/sendPasswordResetEmail.js";
import { ROUTES } from "../constants.js";
import type { GlobalAuthRouteHandler } from "../index.js";

// https://www.rfc-editor.org/rfc/rfc1035#section-2.3.3
// Do not allow uppercase characters.
const generateTenantId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz");

async function alreadyOwner(pg: db.Queryable, email: string): Promise<boolean> {
  const userOwner = await db
    .select("users", { email, email_verified: true, role: "owner" })
    .run(pg);

  return userOwner.length > 0;
}

export const signupGET = (): GlobalAuthRouteHandler => async (ctx) => {
  const signupURL = ctx.router.url(ROUTES.SIGNUP_POST);
  if (typeof signupURL !== "string") throw signupURL;

  ctx.status = 200;
  ctx.body = views.renderString(
    React.createElement(EmailForm, {
      logo: "/public/img/logo.svg",
      header: "Sign up",
      action: signupURL,
    }),
  );
};

export const signupPOST = (): GlobalAuthRouteHandler => async (ctx) => {
  if (!ctx.oidc.allowSignup) {
    throw new OperationError(
      outcomeError("forbidden", "Signup is not allowed."),
    );
  }

  const body = ctx.request.body as
    | { email?: string; password?: string }
    | undefined;

  const email = body?.email;

  if (!email) {
    throw new OperationError(outcomeError("invalid", "Email is required."));
  }

  if (!validator.isEmail(email)) {
    throw new OperationError(outcomeError("invalid", "Email is not valid."));
  }

  if (await alreadyOwner(ctx.FHIRContext.db, email)) {
    throw new OperationError(
      outcomeError(
        "invalid",
        "Email is already registered as an owner for a tenant.",
      ),
    );
  }

  const [user, tenant] = await db.serializable(
    ctx.FHIRContext.db,
    async (txnClient) => {
      const tenantId = generateTenantId();

      const tenant = await db
        .insert("tenants", {
          id: tenantId,
          tenant: {
            id: tenantId,
            name: "Default",
          },
        })
        .run(txnClient);

      const membership = await ctx.FHIRContext.client.create(
        asSystemCTX({
          ...ctx.FHIRContext,
          db: txnClient,
          tenant: tenant.id as TenantId,
        }),
        R4,
        userToMembership({
          scope: "tenant",
          role: "owner",
          tenant: tenant.id,
          email: email,
        }),
      );

      const user: User[] = await db
        .select(
          "users",
          { fhir_user_id: membership.id },
          { columns: USER_QUERY_COLS },
        )
        .run(txnClient);

      if (!user[0]) {
        throw new OperationError(outcomeError("not-found", "User not found."));
      }

      return [user[0], tenant];
    },
  );

  // Alert system admin of new user.
  await sendAlertEmail(
    ctx.FHIRContext.emailProvider,
    "New User",
    `A new user with email '${email}' has signed up.`,
  );

  await sendPasswordResetEmail(
    ctx.router,
    { ...ctx.FHIRContext, tenant: tenant.id as TenantId },
    new TenantAuthorizationCodeManagement(tenant.id as TenantId),
    user,
  );

  ctx.status = 200;
  ctx.body = views.renderString(
    React.createElement(Feedback, {
      logo: "/public/img/logo.svg",
      title: "IGUHealth",
      header: "Email Verification",
      content:
        "An email will arrive in the next few minutes with the next steps to complete your registration.",
    }),
  );
};
