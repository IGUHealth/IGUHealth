import React from "react";
import validator from "validator";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { EmailForm, Feedback, PasswordResetForm } from "@iguhealth/components";
import {
  Membership,
  OperationOutcome,
  code,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { KoaExtensions, asRoot } from "../../../../fhir-server/types.js";
import { AuthorizationCode } from "../../../../storage/postgres/authAdmin/codes.js";
import { StorageTransaction } from "../../../../transactions.js";
import * as views from "../../../../views/index.js";
import { sendPasswordResetEmail } from "../../../sendPasswordReset.js";
import { OIDC_ROUTES } from "../../constants.js";
import * as adminApp from "../../hardcodedClients/admin-app.js";
import type { OIDCRouteHandler } from "../../index.js";

function validatePasswordStrength(
  password: string,
): OperationOutcome | undefined {
  if (password.length < 8) {
    return outcomeError(
      "invalid",
      "Password must be at least 8 characters long.",
    );
  }
  // See https://www.postgresql.org/docs/current/pgcrypto.html because of bf 2a size limit.
  if (password.length > 72) {
    return outcomeError(
      "invalid",
      "Password must be less than 72 characters long.",
    );
  }
  return undefined;
}

function userToMembership(
  user: Partial<s.users.JSONSelectable> & { email: string },
): Membership {
  const member: Membership = {
    id: user.fhir_user_id as id,
    resourceType: "Membership",
    emailVerified: user.email_verified ?? false,
    email: user.email,
    role: (user.role ?? "member") as code,
  };

  return member;
}

export function passwordResetGET(): OIDCRouteHandler {
  return async (ctx) => {
    const queryCode = ctx.request.query.code;
    if (typeof queryCode !== "string") {
      throw new OperationError(outcomeError("invalid", "Code not found."));
    }

    const authorizationCodeSearch =
      await ctx.state.iguhealth.store.auth.authorization_code.where(
        await asRoot(ctx.state.iguhealth),
        ctx.state.iguhealth.tenant,
        {
          type: "password_reset",
          code: queryCode,
        },
      );

    if (
      authorizationCodeSearch.length !== 1 ||
      authorizationCodeSearch[0].is_expired
    ) {
      throw new OperationError(
        outcomeError(
          "invalid",
          "Your code has expired. Please request a new one.",
        ),
      );
    }

    const passwordResetPostUrl = ctx.router.url(
      OIDC_ROUTES.PASSWORD_RESET_VERIFY_POST,
      { tenant: ctx.state.iguhealth.tenant },
    );
    if (passwordResetPostUrl instanceof Error) throw passwordResetPostUrl;

    ctx.status = 200;
    ctx.body = views.renderString(
      React.createElement(PasswordResetForm, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        header: "Set your password",
        action: passwordResetPostUrl,
        code: authorizationCodeSearch[0].code,
      }),
    );
  };
}

async function getAuthorizationCode(
  ctx: NonNullable<KoaExtensions.IGUHealthServices["iguhealth"]>,
  tenant: TenantId,
  code: string,
): Promise<AuthorizationCode> {
  const res = await ctx.store.auth.authorization_code.where(
    await asRoot({ ...ctx, tenant }),
    tenant,
    {
      type: "password_reset",
      code: code,
    },
  );

  if (res.length !== 1) {
    throw new OperationError(outcomeError("invalid", "Code not found."));
  }

  const authorizationCode = res[0];

  if (!authorizationCode || authorizationCode.is_expired) {
    throw new OperationError(
      outcomeError(
        "invalid",
        "Your code has expired. Please request a new one.",
      ),
    );
  }

  return authorizationCode;
}

export function passwordResetPOST(): OIDCRouteHandler {
  return async (ctx) => {
    const body = ctx.request.body as
      | { code?: string; password?: string; passwordConfirm?: string }
      | undefined;

    if (!body?.code) {
      throw new OperationError(outcomeError("invalid", "Code not found."));
    }
    const passwordResetPostUrl = ctx.router.url(
      OIDC_ROUTES.PASSWORD_RESET_VERIFY_POST,
      { tenant: ctx.state.iguhealth.tenant },
    );
    if (passwordResetPostUrl instanceof Error) throw passwordResetPostUrl;

    if (!body?.password) {
      ctx.status = 200;
      ctx.body = views.renderString(
        React.createElement(PasswordResetForm, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Set your password",
          action: passwordResetPostUrl,
          code: body.code,
          error: outcomeError("invalid", "You must enter a password"),
        }),
      );
      return;
    }

    if (body?.password !== body?.passwordConfirm) {
      ctx.status = 200;
      ctx.body = views.renderString(
        React.createElement(PasswordResetForm, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Set your password",
          action: passwordResetPostUrl,
          code: body.code,
          error: outcomeError(
            "invalid",
            "Passwords do not match. Please re-enter and try again.",
          ),
        }),
      );
      return;
    }

    const passwordValidStrength = validatePasswordStrength(body.password);
    if (passwordValidStrength) {
      ctx.status = 200;
      ctx.body = views.renderString(
        React.createElement(PasswordResetForm, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Set your password",
          action: passwordResetPostUrl,
          code: body.code,
          error: passwordValidStrength,
        }),
      );
      return;
    }
    try {
      await StorageTransaction(
        ctx.state.iguhealth,
        db.IsolationLevel.Serializable,
        async (fhirContext) => {
          if (!body.code) {
            throw new OperationError(
              outcomeError("invalid", "Code not found."),
            );
          }
          const authorizationCode = await getAuthorizationCode(
            fhirContext,
            fhirContext.tenant,
            body.code,
          );
          const email = (authorizationCode.meta as Record<string, string>)
            ?.email;
          const user = await fhirContext.store.auth.user.read(
            await asRoot(fhirContext),
            fhirContext.tenant,
            authorizationCode.user_id as id,
          );

          if (user?.email !== email) {
            throw new OperationError(
              outcomeError("invalid", "Email does not match the user."),
            );
          }

          const update = await fhirContext.store.auth.user.update(
            await asRoot(fhirContext),
            fhirContext.tenant,
            user.fhir_user_id as id,
            {
              ...user,
              email,
              password: body.password,
              // Password reset goes through email so we can assume email is verified.
              email_verified: true,
            },
          );

          await fhirContext.client.update(
            await asRoot({
              ...fhirContext,
              tenant: update.tenant as TenantId,
            }),
            R4,
            "Membership",
            update.fhir_user_id as id,
            userToMembership(update),
          );

          await fhirContext.store.auth.authorization_code.delete(
            await asRoot(fhirContext),
            fhirContext.tenant,
            {
              code: body.code,
            },
          );
        },
      );
      const AdminAppURL = await adminApp.redirectURL(
        ctx.state.iguhealth.config,
        ctx.state.iguhealth.tenant,
      );
      if (!AdminAppURL)
        throw new OperationError(
          outcomeFatal("invariant", "Admin app URL not found for tenant."),
        );

      ctx.redirect(AdminAppURL);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        db.isDatabaseError(
          error,
          "IntegrityConstraintViolation_UniqueViolation",
        )
      ) {
        throw new OperationError(
          outcomeError(
            "transient",
            "User with this email is already the owner of a tenant.",
          ),
        );
      } else if (db.isDatabaseError(error)) {
        throw new OperationError(
          outcomeError("transient", "Database error. Please try again."),
        );
      } else {
        throw error;
      }
    }
  };
}

export const passwordResetInitiateGet = (): OIDCRouteHandler => async (ctx) => {
  const passwordResetInitiatePostURL = ctx.router.url(
    OIDC_ROUTES.PASSWORD_RESET_INITIATE_POST,
    { tenant: ctx.state.iguhealth.tenant },
  );
  if (typeof passwordResetInitiatePostURL !== "string")
    throw passwordResetInitiatePostURL;

  ctx.status = 200;
  ctx.body = views.renderString(
    React.createElement(EmailForm, {
      logo: "/public/img/logo.svg",
      header: "Email Verification",
      action: passwordResetInitiatePostURL,
    }),
  );
};

/**
 * Initiates password reset process by sending an email to the user with a link to reset their password.
 * @param ctx Koa fhir context
 */
export function passwordResetInitiatePOST(): OIDCRouteHandler {
  return async (ctx) => {
    const body = ctx.request.body as
      | { email?: string; password?: string }
      | undefined;

    if (!ctx.state.iguhealth.emailProvider)
      throw new OperationError(
        outcomeFatal(
          "not-supported",
          "Email verification is not supported on this instance.",
        ),
      );

    const email = body?.email ?? "";

    if (!validator.isEmail(email)) {
      throw new OperationError(
        outcomeError("invalid", "Must have a valid email address."),
      );
    }

    const usersWithEmail = await ctx.state.iguhealth.store.auth.user.where(
      await asRoot(ctx.state.iguhealth),
      ctx.state.iguhealth.tenant,
      {
        email: email,
      },
    );

    if (usersWithEmail.length > 1) {
      throw new OperationError(
        outcomeError("invalid", "Multiple users found with the same email."),
      );
    }

    const user = usersWithEmail[0];
    // Pretend email sent to avoid phishing for email addresses.
    if (!user) {
      ctx.state.iguhealth.logger.warn(
        `not sending password reset for non existing user: '${email}' `,
      );
      ctx.status = 200;
      ctx.body = views.renderString(
        React.createElement(Feedback, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Email Verification",
          content:
            "An email will arrive in the next few minutes with the next steps to reset your password.",
        }),
      );
      return;
    }

    if (!ctx.state.iguhealth.config.get("EMAIL_FROM")) {
      throw new OperationError(
        outcomeFatal(
          "invariant",
          "EMAIL_FROM environment variable is not set.",
        ),
      );
    }

    const membership =
      await ctx.state.iguhealth.store.fhir.readLatestResourceById(
        await asRoot(ctx.state.iguhealth),
        R4,
        "Membership",
        user.fhir_user_id as id,
      );

    if (!membership || membership.resourceType !== "Membership") {
      throw new OperationError(
        outcomeFatal("invariant", "Membership not found for user."),
      );
    }

    await sendPasswordResetEmail(
      await asRoot(ctx.state.iguhealth),
      membership,
      {
        email: {
          subject: "IGUHealth Email Verification",
          body: "To verify your email and set your password click below.",
          acceptText: "Reset Password",
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
          "An email will arrive in the next few minutes with the next steps to reset your password.",
      }),
    );
  };
}
