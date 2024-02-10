import React from "react";
import * as db from "zapatos/db";

import { Feedback, PasswordResetForm } from "@iguhealth/components";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as views from "../../../views/index.js";
import { ROUTES } from "../constants.js";
import * as dbCode from "../db/code.js";
import type { ManagementRouteHandler } from "../index.js";

export const passwordResetGET: ManagementRouteHandler = async (ctx) => {
  const queryCode = ctx.request.query.code;
  if (typeof queryCode !== "string") {
    throw new OperationError(outcomeError("invalid", "Code not found."));
  }

  const authorizationCode = await dbCode.findAuthorizationCode(
    ctx.postgres,
    "password_reset",
    queryCode,
  );

  if (!authorizationCode || authorizationCode.is_expired) {
    throw new OperationError(
      outcomeError(
        "invalid",
        "Your code has expired. Please request a new one.",
      ),
    );
  }

  const passwordResetPostUrl = ctx.router.url(ROUTES.PASSWORD_RESET_POST);
  if (passwordResetPostUrl instanceof Error) throw passwordResetPostUrl;

  views.render(
    ctx,
    React.createElement(PasswordResetForm, {
      logo: "/public/img/logo.svg",
      title: "IGUHealth",
      header: "Reset Password",
      action: passwordResetPostUrl,
      code: authorizationCode.code,
    }),
  );
};

export const passwordResetPOST: ManagementRouteHandler = async (ctx) => {
  const body = ctx.request.body as
    | { code?: string; password?: string; passwordConfirm?: string }
    | undefined;

  if (!body?.code) {
    throw new OperationError(outcomeError("invalid", "Code not found."));
  }
  const passwordResetPostUrl = ctx.router.url(ROUTES.PASSWORD_RESET_POST);
  if (passwordResetPostUrl instanceof Error) throw passwordResetPostUrl;

  if (!body?.password) {
    views.render(
      ctx,
      React.createElement(PasswordResetForm, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        header: "Reset Password",
        action: passwordResetPostUrl,
        code: body.code,
        error: outcomeError("invalid", "You must enter a password"),
      }),
    );
    return;
  }

  if (body?.password !== body?.passwordConfirm) {
    views.render(
      ctx,
      React.createElement(PasswordResetForm, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        header: "Reset Password",
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

  const authorizationCode = await dbCode.findAuthorizationCode(
    ctx.postgres,
    "password_reset",
    body.code,
  );

  if (!authorizationCode || authorizationCode.is_expired) {
    throw new OperationError(
      outcomeError(
        "invalid",
        "Your code has expired. Please request a new one.",
      ),
    );
  }

  db.serializable(ctx.postgres, async (txnClient) => {
    console.log("pass:", body.password);

    await db
      .update(
        "tenant_owners",
        { password: body.password, email_verified: true },
        { email: authorizationCode.user_id },
      )
      .run(txnClient);
    await db.deletes("authorization_code", { code: body.code }).run(txnClient);
  });

  views.render(
    ctx,
    React.createElement(Feedback, {
      logo: "/public/img/logo.svg",
      title: "IGUHealth",
      header: "Password Reset",
      content: "Your password has been set.",
    }),
  );
};
