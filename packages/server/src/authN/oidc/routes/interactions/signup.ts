import React from "react";

import { EmailForm, Feedback } from "@iguhealth/components";
import {
  Membership,
  Parameters,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthPasswordReset } from "@iguhealth/generated-ops/lib/r4/ops";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asRoot } from "../../../../fhir-server/types.js";
import * as views from "../../../../views/index.js";
import { OPERATIONS_QUEUE } from "../../../../worker/kafka/constants.js";
import * as users from "../../../db/users/index.js";
import { sendPasswordResetEmail } from "../../../sendPasswordReset.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { OIDCRouteHandler } from "../../index.js";
import { sendAlertEmail } from "../../utilities/sendAlertEmail.js";

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
    await users.search(
      ctx.state.iguhealth.store.getClient(),
      ctx.state.iguhealth.tenant,
      {
        email,
      },
    )
  )[0];

  if (existingUser !== undefined) {
    const membership = await ctx.state.iguhealth.store.readLatestResourceById(
      asRoot(ctx.state.iguhealth),
      R4,
      existingUser.fhir_user_id as id,
    );
    if (!membership || membership.resourceType !== "Membership") {
      throw new OperationError(
        outcomeError("exception", "Membership not found"),
      );
    }

    await sendPasswordResetEmail(ctx.state.iguhealth, membership, {
      email: {
        subject: "IGUHealth Email Verification",
        body: "To verify your email and set your password click below.",
        acceptText: "Reset Password",
      },
    });
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

    const user = await users.search(
      ctx.state.iguhealth.store.getClient(),
      ctx.state.iguhealth.tenant,
      {
        fhir_user_id: membership.id,
        fhir_user_versionid: membership.meta?.versionId,
      },
    );

    // Alert system admin of new user.
    await sendAlertEmail(
      ctx.state.iguhealth.emailProvider,
      "New User",
      `A new user with email '${user[0]?.email}' has signed up.`,
    );

    await sendPasswordResetEmail(ctx.state.iguhealth, membership, {
      email: {
        subject: "IGUHealth Email Verification",
        body: "To verify your email and set your password click below.",
        acceptText: "Reset Password",
      },
    });
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
