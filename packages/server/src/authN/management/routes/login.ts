import React from "react";

import { Login } from "@iguhealth/components";

import * as views from "../../../views/index.js";
import { ROUTES } from "../constants.js";
import type { ManagementRouteHandler } from "../index.js";

export const loginPost: ManagementRouteHandler = async (ctx) => {
  ctx.status = 200;
  ctx.body = "LOGIN POST";
};

export const loginGet: ManagementRouteHandler = async (ctx) => {
  const loginRoute = ctx.router.url(ROUTES.LOGIN_POST);
  if (loginRoute instanceof Error) throw loginRoute;
  const signupURL = ctx.router.url(ROUTES.SIGNUP_GET);
  if (signupURL instanceof Error) throw signupURL;
  const forgotPasswordURL = ctx.router.url(ROUTES.PASSWORD_RESET_INITIATE_GET);
  if (forgotPasswordURL instanceof Error) throw forgotPasswordURL;

  views.render(
    ctx,
    React.createElement(Login, {
      logo: "/public/img/logo.svg",
      title: "IGUHealth",
      action: loginRoute,
      signupURL,
      forgotPasswordURL,
    }),
  );
};
