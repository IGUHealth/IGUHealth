import Router from "@koa/router";
import type * as Koa from "koa";
import React from "react";
import * as db from "zapatos/db";

import { Feedback, SignupForm } from "@iguhealth/components";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { KoaFHIRServicesContext } from "../../fhir-context/koa.js";
import * as views from "../../views/index.js";
import * as dbCode from "./db/code.js";
import * as dbUser from "./db/user.js";

type Email = string & { _emailBrand: never };

const ROUTES = {
  SIGNUP_GET: "management-signup-get",
  SIGNUP_POST: "management-signup-post",
  VERIFY_EMAIL_GET: "management-verify-email-get",
  LOGIN_GET: "management-login-get",
};

const EMAIL_REGEX =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
// Pulled from https://github.com/manishsaraan/email-validator/blob/master/index.js
function validateEmail(email: string | undefined): email is Email {
  if (!email) return false;
  const emailParts = email.split("@");
  if (emailParts.length !== 2) return false;

  const account = emailParts[0];
  const address = emailParts[1];

  if (account.length > 64 || address.length > 255) return false;

  const domainParts = address.split(".");

  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return EMAIL_REGEX.test(email);
}

/**
 * Management api for creating tenants and managing tenant owners.
 */
export function createManagementRouter(prefix: string) {
  const managementRouter = new Router<
    Koa.DefaultState,
    KoaFHIRServicesContext<Koa.DefaultContext>
  >({
    prefix,
  });

  /**
   * Signup a new user with an associated tenant.
   * Need to also validate the user's email.
   */

  managementRouter.get(
    ROUTES.SIGNUP_GET,
    "/interaction/signup",
    async (ctx) => {
      const signupURL = managementRouter.url(ROUTES.SIGNUP_POST);
      if (typeof signupURL !== "string") throw signupURL;

      views.render(
        ctx,
        React.createElement(SignupForm, {
          logo: "/public/img/logo.svg",
          action: signupURL,
        }),
      );
    },
  );

  managementRouter.post(
    ROUTES.SIGNUP_POST,
    "/interaction/signup",
    async (ctx) => {
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

      if (typeof body.password !== "string") {
        throw new OperationError(
          outcomeError("invalid", "must have a password"),
        );
      }

      let user = await dbUser.findManagementUserByEmail(
        ctx.postgres,
        body.email,
      );
      if (!user) {
        user = await dbUser.createUser(ctx.postgres, body.email, body.password);
      }

      if (!process.env.EMAIL_FROM) {
        throw new OperationError(
          outcomeFatal(
            "invariant",
            "EMAIL_FROM environment variable is not set.",
          ),
        );
      }

      if (!user.email_verified) {
        const code = await dbCode.createAuthorizationCode(
          ctx.postgres,
          user.email,
        );

        const emailVerificationURL = managementRouter.url(
          ROUTES.VERIFY_EMAIL_GET,
          {},
          { query: { code: code.code } },
        );
        if (typeof emailVerificationURL !== "string")
          throw emailVerificationURL;

        ctx.emailProvider.sendEmail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "IGUHealth Email Verification",
          html: `Follow the following link to verify your email <a href="${process.env.API_URL}${emailVerificationURL}" clicktracking="off">  Here </a>`,
        });

        ctx.status = 201;
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
        const loginURL = managementRouter.url(ROUTES.LOGIN_GET);
        if (typeof loginURL !== "string") throw loginURL;
        ctx.redirect(loginURL);
      }
    },
  );

  managementRouter.get(
    ROUTES.VERIFY_EMAIL_GET,
    "/interaction/verify-email",
    async (ctx) => {
      const passedCode = ctx.request.query.code;
      if (typeof passedCode !== "string") {
        throw new OperationError(outcomeError("invalid", "must have a code"));
      }

      const foundCode = await dbCode.findAuthorizationCode(
        ctx.postgres,
        "signup_confirmation",
        passedCode,
      );

      if (foundCode.is_expired)
        throw new OperationError(
          outcomeError(
            "expired",
            "Your code has expired. Please request a new one.",
          ),
        );

      await db
        .update(
          "tenant_owners",
          { email_verified: true },
          { email: foundCode.user_id },
        )
        .run(ctx.postgres);

      views.render(
        ctx,
        React.createElement(Feedback, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Email Verified",
          content: "Your email has been verified.",
        }),
      );
    },
  );

  /**
   * Signup a new user with an associated tenant.
   * Need to also validate the user's email.
   */
  managementRouter.get(ROUTES.LOGIN_GET, "/interaction/login", async (ctx) => {
    ctx.status = 200;
    ctx.body = "LOGIN";
  });

  return managementRouter;
}
