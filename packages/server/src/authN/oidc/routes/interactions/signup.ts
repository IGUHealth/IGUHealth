import React from "react";

import { EmailForm, Feedback } from "@iguhealth/components";
import { Membership } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asRoot } from "../../../../fhir-api/types.js";
import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { OIDCRouteHandler } from "../../index.js";
import { sendAlertEmail } from "../../utilities/sendAlertEmail.js";
import { sendPasswordResetEmail } from "../../utilities/sendPasswordResetEmail.js";

export const signupGET = (): OIDCRouteHandler => async (ctx) => {
  const signupURL = ctx.router.url(OIDC_ROUTES.SIGNUP_POST, {
    tenant: ctx.state.iguhealth.tenant,
  });
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

export const signupPOST = (): OIDCRouteHandler => async (ctx) => {
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

  const existingUser = (
    await ctx.state.oidc.userManagement.search(ctx.state.iguhealth, {
      email,
    })
  )[0];
  if (existingUser !== undefined) {
    await sendPasswordResetEmail(
      ctx.router,
      { ...ctx.state.iguhealth, tenant: ctx.state.iguhealth.tenant },
      ctx.state.oidc.codeManagement,
      existingUser,
    );
  } else {
    const membership = await ctx.state.iguhealth.client.create(
      asRoot(ctx.state.iguhealth),
      R4,
      {
        resourceType: "Membership",
        role: "member",
        email,
      } as Membership,
    );

    const user = await ctx.state.oidc.userManagement.search(
      ctx.state.iguhealth,
      {
        fhir_user_id: membership.id,
        fhir_user_versionid: parseInt(membership.meta?.versionId ?? ""),
      },
    );

    // Alert system admin of new user.
    await sendAlertEmail(
      ctx.state.iguhealth.emailProvider,
      "New User",
      `A new user with email '${user[0]?.email}' has signed up.`,
    );
    await sendPasswordResetEmail(
      ctx.router,
      { ...ctx.state.iguhealth, tenant: ctx.state.iguhealth.tenant },
      ctx.state.oidc.codeManagement,
      user[0],
    );
  }

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
