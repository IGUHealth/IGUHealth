import React from "react";

import { EmailForm } from "@iguhealth/components";

import * as views from "../../../../views/index.js";
import { ROUTES } from "../../constants.js";
import type { ManagementRouteHandler } from "../../index.js";

export const signupGET: ManagementRouteHandler = async (ctx) => {
  const signupURL = ctx.router.url(ROUTES.PASSWORD_RESET_INITIATE_POST);
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
