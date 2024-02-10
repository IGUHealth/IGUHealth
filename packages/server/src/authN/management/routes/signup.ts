import React from "react";

import { Feedback, SignupForm } from "@iguhealth/components";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import * as views from "../../../views/index.js";
import { ROUTES } from "../constants.js";
import * as dbCode from "../db/code.js";
import * as dbUser from "../db/user.js";
import type { ManagementRouteHandler } from "../index.js";
import { validateEmail } from "../utilities.js";

/**
 * Signup a new user with an associated tenant.
 * Need to also validate the user's email.
 */
export const signupPOST: ManagementRouteHandler = async (ctx) => {
  const body = ctx.request.body as
    | { email?: string; password?: string }
    | undefined;

  if (!ctx.emailProvider)
    throw new OperationError(
      outcomeFatal(
        "not-supported",
        "Email verification is not supported on this instance.",
      ),
    );

  if (!validateEmail(body?.email)) {
    throw new OperationError(
      outcomeError("invalid", "Must have a valid email address."),
    );
  }

  let user = await dbUser.findManagementUserByEmail(ctx.postgres, body.email);
  if (!user) {
    user = await dbUser.createUser(ctx.postgres, body.email);
  }

  if (!process.env.EMAIL_FROM) {
    throw new OperationError(
      outcomeFatal("invariant", "EMAIL_FROM environment variable is not set."),
    );
  }
  if (
    await dbCode.doesCodeAlreadyExistForUser(
      ctx.postgres,
      user.email,
      "password_reset",
    )
  ) {
    views.render(
      ctx,
      React.createElement(Feedback, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        header: "Email Verification",
        content:
          "We have sent an email to your email address. Please verify your email address to login.",
      }),
    );
  } else {
    const code = await dbCode.createAuthorizationCode(
      ctx.postgres,
      "password_reset",
      user.email,
    );

    const emailVerificationURL = ctx.router.url(
      ROUTES.PASSWORD_RESET_GET,
      {},
      { query: { code: code.code } },
    );
    if (typeof emailVerificationURL !== "string") throw emailVerificationURL;

    ctx.emailProvider.sendEmail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "IGUHealth Email Verification",
      html: `Follow the following link to verify your email and set your password. <a href="${process.env.API_URL}${emailVerificationURL}" clicktracking="off">  Here </a>`,
    });

    views.render(
      ctx,
      React.createElement(Feedback, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        header: "Email Verification",
        content:
          "We have sent an email to your email address. Please verify your email address to login.",
      }),
    );
  }
};

export const signupGET: ManagementRouteHandler = async (ctx) => {
  const signupURL = ctx.router.url(ROUTES.SIGNUP_POST);
  if (typeof signupURL !== "string") throw signupURL;

  views.render(
    ctx,
    React.createElement(SignupForm, {
      logo: "/public/img/logo.svg",
      action: signupURL,
    }),
  );
};
