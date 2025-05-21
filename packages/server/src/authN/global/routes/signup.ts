import React from "react";
import validator from "validator";
import * as db from "zapatos/db";

import { EmailForm, Feedback } from "@iguhealth/components";
import {
  Membership,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import { DYNAMIC_TOPIC } from "../../../queue/implementations/topics/dynamic-topic.js";
import {
  Consumers,
  TenantTopic,
} from "../../../queue/implementations/topics/index.js";
import { generateTenantId } from "../../../storage/postgres/authAdmin/tenants.js";
import { QueueBatch, StorageTransaction } from "../../../transactions.js";
import * as views from "../../../views/index.js";
import { sendAlertEmail } from "../../oidc/utilities/sendAlertEmail.js";
import { sendPasswordResetEmail } from "../../sendPasswordReset.js";
import { ROUTES } from "../constants.js";
import type { GlobalAuthRouteHandler } from "../index.js";

async function findExistingOwner(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  email: string,
): Promise<[TenantId, Membership] | undefined> {
  const result = await db
    .select("users", { email, role: "owner" })
    .run(ctx.store.getClient());
  const userOwner = result[0];
  if (userOwner) {
    const member = await ctx.client.read(
      asRoot({ ...ctx, tenant: userOwner.tenant as TenantId }),
      R4,
      "Membership",
      userOwner.fhir_user_id as id,
    );
    if (!member) {
      throw new OperationError(
        outcomeError("not-found", "Owner user not found."),
      );
    }

    return [userOwner.tenant as TenantId, member];
  }
  return undefined;
}

async function createOrRetrieveUser(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  email: string,
): Promise<[TenantId, Membership]> {
  const existingOwner = await findExistingOwner(ctx, email);
  if (existingOwner) {
    return existingOwner;
  } else {
    const result: [TenantId, Membership] = await QueueBatch(
      ctx,
      async (ctx) => {
        const [membership, tenant] = await StorageTransaction(
          ctx,
          db.IsolationLevel.RepeatableRead,
          async (ctx) => {
            const tenant = await ctx.store.auth.tenant.create(
              asRoot({ ...ctx, tenant: "system" as TenantId }),
              {
                id: generateTenantId(),
              },
            );
            const membership = await ctx.client.create(
              asRoot({
                ...ctx,
                tenant: tenant.id as TenantId,
              }),
              R4,
              {
                resourceType: "Membership",
                emailVerified: false,
                email: email,
                role: "owner" as code,
              },
            );

            return [membership, tenant];
          },
        );

        await ctx.queue.send(DYNAMIC_TOPIC, [
          {
            value: {
              action: "subscribe",
              topic: TenantTopic(tenant.id as TenantId, "operations"),
              consumer_groups: [
                Consumers.Storage,
                Consumers.SearchIndexing,
                Consumers.SubscriptionV1,
              ],
            },
          },
        ]);

        return [tenant.id as TenantId, membership];
      },
    );

    // Alert system admin of new user.
    await sendAlertEmail(
      ctx.config,
      ctx.emailProvider,
      "New User",
      `A new user with email '${email}' has signed up.`,
    );

    return result;
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

  await StorageTransaction(
    ctx.state.iguhealth,
    db.IsolationLevel.RepeatableRead,
    async (iguhealth) => {
      const [tenant, membership] = await createOrRetrieveUser(iguhealth, email);

      await sendPasswordResetEmail(
        asRoot({ ...iguhealth, tenant }),
        membership,
        {
          email: {
            acceptText: "Reset Password",
            body: "To verify your email and set your password click below.",
            subject: "IGUHealth Email Verification",
          },
        },
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
    },
  );
};
