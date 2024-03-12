import React from "react";
import { user_scope } from "zapatos/schema";

import { EmailForm } from "@iguhealth/components";

import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { ManagementRouteHandler } from "../../index.js";

export const signupGET =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
    const signupURL = ctx.router.url(
      OIDC_ROUTES(scope).PASSWORD_RESET_INITIATE_POST,
      { tenant: ctx.oidc.tenant },
    );
    if (typeof signupURL !== "string") throw signupURL;

    views.renderPipe(
      ctx,
      React.createElement(EmailForm, {
        logo: "/public/img/logo.svg",
        header: "Signup",
        action: signupURL,
      }),
    );
  };
