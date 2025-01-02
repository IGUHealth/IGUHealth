import React from "react";
import validator from "validator";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { EmailForm, Feedback } from "@iguhealth/components";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX, asRoot } from "../../../fhir-api/types.js";
import { FHIRTransaction } from "../../../fhir-storage/transactions.js";
import * as views from "../../../views/index.js";
import * as tenants from "../../db/tenant.js";
import { User } from "../../db/users/index.js";
import { userToMembership } from "../../db/users/utilities.js";
import { sendAlertEmail } from "../../oidc/utilities/sendAlertEmail.js";
import { sendPasswordResetEmail } from "../../oidc/utilities/sendPasswordResetEmail.js";
import { ROUTES } from "../constants.js";
import type { GlobalAuthRouteHandler } from "../index.js";
import * as users from "../../db/users/index.js";

async function findExistingOwner(
  pg: db.Queryable,
  email: string,
): Promise<s.users.JSONSelectable | undefined> {
  const userOwner = await db.select("users", { email, role: "owner" }).run(pg);
  return userOwner[0];
}

async function createOrRetrieveUser(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  email: string,
): Promise<User> {
  const existingOwner = await findExistingOwner(ctx.db, email);
  if (existingOwner) {
    return existingOwner;
  } else {
    const user = await FHIRTransaction(
      ctx,
      db.IsolationLevel.Serializable,
      async (ctx) => {
        const tenant = await tenants.create(ctx, {});

        const membership = await ctx.client.create(
          await asRoot({
            ...ctx,
            tenant: tenant.id as TenantId,
          }),
          R4,
          userToMembership({
            role: "owner",
            tenant: tenant.id,
            email: email,
            email_verified: false,
          }),
        );

        const user: User[] = await users.search(ctx.db, tenant.id as TenantId, {
          fhir_user_id: membership.id,
        });

        if (!user[0]) {
          throw new OperationError(
            outcomeError("not-found", "User not found."),
          );
        }
        return user[0];
      },
    );

    return user;
  }
}

export const signupGET = (): GlobalAuthRouteHandler => async (ctx) => {
  const signupURL = ctx.router.url(ROUTES.SIGNUP_POST);
  if (typeof signupURL !== "string") throw signupURL;

  const email = ctx.request.query?.email ?? "";
  const errors = ctx.request.query?.error ? ctx.request.query.error : [];

  ctx.status = 200;
  ctx.body = views.renderString(
    React.createElement(EmailForm, {
      email: email.toString(),
      errors: Array.isArray(errors) ? errors : [errors],
      logo: "/public/img/logo.svg",
      header: "Sign up",
      action: signupURL,
    }),
  );
};

export const signupPOST = (): GlobalAuthRouteHandler => async (ctx) => {
  if (!ctx.state.allowSignup) {
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

  const user = await createOrRetrieveUser(ctx.state.iguhealth, email);

  // Alert system admin of new user.
  await sendAlertEmail(
    ctx.state.iguhealth.emailProvider,
    "New User",
    `A new user with email '${email}' has signed up.`,
  );

  await sendPasswordResetEmail(
    ctx.router,
    { ...ctx.state.iguhealth, tenant: user.tenant as TenantId },
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
