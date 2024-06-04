/**
 * Global login is to redirect user to their tenant login page.
 * To do this filter to see what tenants a user is a member of display tenant select screen if multiple
 * If none redirect to signup page.
 */

import React from "react";
import validator from "validator";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { Login, TenantSelect } from "@iguhealth/components";
import { TenantClaim, TenantId } from "@iguhealth/jwt";

import * as views from "../../../views/index.js";
import { OIDC_ROUTES } from "../../oidc/constants.js";
import { ROUTES } from "../constants.js";
import { GlobalAuthRouteHandler } from "../index.js";

function getRoutes(ctx: Parameters<GlobalAuthRouteHandler>[0]) {
  const loginRoute = ctx.router.url(ROUTES.LOGIN_POST, {
    tenant: ctx.oidc.tenant,
  });
  if (loginRoute instanceof Error) throw loginRoute;

  const signupURL = ctx.router.url(ROUTES.SIGNUP_GET, {
    tenant: ctx.oidc.tenant,
  });
  if (signupURL instanceof Error) throw signupURL;

  return {
    signupURL: ctx.oidc.allowSignup ? signupURL : undefined,
    loginRoute,
  };
}

export const loginGET = (): GlobalAuthRouteHandler => async (ctx) => {
  const { signupURL, loginRoute } = getRoutes(ctx);

  ctx.status = 200;
  ctx.body = views.renderString(
    React.createElement(Login, {
      title: "IGUHealth",
      logo: "/public/img/logo.svg",
      hidePassword: true,
      // messages: message ? [message] : [],
      action: loginRoute,
      signupURL,
    }),
  );
};

export const loginPOST = (): GlobalAuthRouteHandler => async (ctx) => {
  const { signupURL, loginRoute } = getRoutes(ctx);
  const email = ctx.request.body.email;
  if (!validator.isEmail(email)) {
    ctx.body = views.renderString(
      React.createElement(Login, {
        title: "IGUHealth",
        logo: "/public/img/logo.svg",
        hidePassword: true,
        messages: ["Must have a valid email address."],
        action: loginRoute,
        signupURL,
      }),
    );
    return;
  }

  const users = await db
    .select(
      "users",
      // Ensure that the email is verified before retrieval.
      // Means user has completed signup process.
      {
        email,
        email_verified: true,
        scope: "tenant",
      },
      { columns: ["tenant", "role"] },
    )
    .run(ctx.FHIRContext.db);

  console.log(users);

  const tenantClaims: TenantClaim<s.user_role>[] = users.map((u) => ({
    id: u.tenant as TenantId,
    userRole: u.role as s.user_role,
  }));

  ctx.body = views.renderString(
    React.createElement(TenantSelect, {
      title: "IGUHealth",
      logo: "/public/img/logo.svg",
      email,
      tenants: tenantClaims,
      generateTenantURL: (email, tenantId) => {
        const route = ctx.router.url(
          OIDC_ROUTES.LOGIN_GET,
          {
            tenant: tenantId,
          },
          { query: { email } },
        );
        if (route instanceof Error) throw route;
        return route;
      },
    }),
  );
};
