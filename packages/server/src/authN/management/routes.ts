import Router from "@koa/router";
import type * as Koa from "koa";
import { nanoid } from "nanoid";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { KoaFHIRServicesContext } from "../../fhir-context/koa.js";
import { createAuthorizationCode } from "./db/code.js";
import { findManagementUserByEmail } from "./db/user.js";
import Feedback from "./views/feedback.js";
import SignupFormView from "./views/signup-form.js";

type Email = string & { _emailBrand: never };

const ROUTES = {
  SIGNUP_GET: "management-signup-get",
  SIGNUP_POST: "management-signup-post",
  FEEDBACK_EMAIL_GET: "management-feedback-email-get",
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

  managementRouter.get(ROUTES.SIGNUP_GET, "/user/signup", async (ctx) => {
    const stream = new PassThrough();

    const signupURL = managementRouter.url(ROUTES.SIGNUP_POST);
    if (typeof signupURL !== "string") throw signupURL;

    const { pipe } = renderToPipeableStream(
      React.createElement(SignupFormView, { action: signupURL }),
      {
        // bootstrapScripts: ["/main.js"],
        onShellReady() {
          ctx.respond = false;
          ctx.status = 200;
          ctx.set("content-type", "text/html");
          pipe(stream);
          stream.end();
        },
      },
    );

    ctx.body = stream;
  });

  managementRouter.post(ROUTES.SIGNUP_POST, "/user/signup", async (ctx) => {
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
      throw new OperationError(outcomeError("invalid", "must have a password"));
    }

    let user = await findManagementUserByEmail(ctx.postgres, body.email);

    if (!user) {
      const newTenant: s.tenants.Insertable = {
        id: nanoid(),
        tenant: {
          id: nanoid(),
          name: "Default",
        },
      };

      const tenant = await db.insert("tenants", newTenant).run(ctx.postgres);
      const newUser: s.tenant_owners.Insertable = {
        tenant: tenant.id,
        email: body.email,
        password: body.password,
        email_verified: false,
      };

      user = await db.insert("tenant_owners", newUser).run(ctx.postgres);
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
      const code = await createAuthorizationCode(ctx, user.email);

      const emailVerificationURL = managementRouter.url(
        ROUTES.VERIFY_EMAIL_GET,
        {},
        { query: { code: code.code } },
      );
      if (typeof emailVerificationURL !== "string") throw emailVerificationURL;

      ctx.emailProvider.sendEmail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "IGUHealth Email Verification",
        html: `Follow the following link to verify your email <a href="${process.env.API_URL}${emailVerificationURL}" clicktracking="off">  Here </a>`,
      });

      const alertUserEmailURL = managementRouter.url(ROUTES.FEEDBACK_EMAIL_GET);
      if (typeof alertUserEmailURL !== "string") throw alertUserEmailURL;

      ctx.redirect(alertUserEmailURL);
    } else {
      const loginURL = managementRouter.url(ROUTES.LOGIN_GET);
      if (typeof loginURL !== "string") throw loginURL;
      ctx.redirect(loginURL);
    }
  });

  managementRouter.get(
    ROUTES.FEEDBACK_EMAIL_GET,
    "/user/feedback-email",
    async (ctx) => {
      const stream = new PassThrough();

      const { pipe } = renderToPipeableStream(
        React.createElement(Feedback, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Email Verification",
          content:
            "We have sent an email to your email address. Please verify your email address to login.",
        }),
        {
          // bootstrapScripts: ["/main.js"],
          onShellReady() {
            ctx.respond = false;
            ctx.status = 200;
            ctx.set("content-type", "text/html");
            pipe(stream);
            stream.end();
          },
        },
      );

      ctx.body = stream;
    },
  );

  managementRouter.get(
    ROUTES.VERIFY_EMAIL_GET,
    "/user/verify-email",
    async (ctx) => {
      const passedCode = ctx.request.query.code;
      if (typeof passedCode !== "string") {
        throw new OperationError(outcomeError("invalid", "must have a code"));
      }
      const where: s.authorization_code.Whereable = {
        code: passedCode,
        type: "signup_confirmation",
      };
      const foundCode = await db.sql<
        s.authorization_code.SQL,
        Array<s.authorization_code.Selectable & { is_expired: boolean }>
      >`SELECT *, NOW() > ${"created_at"} + ${"duration_valid_seconds"} as is_expired FROM ${"authorization_code"} WHERE ${where}`.run(
        ctx.postgres,
      );

      if (foundCode.length === 0)
        throw new OperationError(
          outcomeError("invalid", "Could not verify your email."),
        );
      if (foundCode[0].is_expired)
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
          { email: foundCode[0].user_id },
        )
        .run(ctx.postgres);

      const stream = new PassThrough();

      const { pipe } = renderToPipeableStream(
        React.createElement(Feedback, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Email Verified",
          content: "Your email has been verified.",
        }),
        {
          // bootstrapScripts: ["/main.js"],
          onShellReady() {
            ctx.respond = false;
            ctx.status = 200;
            ctx.set("content-type", "text/html");
            pipe(stream);
            stream.end();
          },
        },
      );

      ctx.body = stream;
    },
  );
  /**
   * Signup a new user with an associated tenant.
   * Need to also validate the user's email.
   */
  managementRouter.get(ROUTES.LOGIN_GET, "/user/login", async (ctx) => {
    ctx.status = 200;
    ctx.body = "LOGIN";
  });

  return managementRouter;
}
