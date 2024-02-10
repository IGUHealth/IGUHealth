import Router from "@koa/router";
import type * as Koa from "koa";

import { KoaFHIRServicesContext } from "../../fhir-context/koa.js";
import { ROUTES } from "./constants.js";
import * as routes from "./routes/index.js";

export type ManagementRouteHandler = Parameters<
  ReturnType<typeof createManagementRouter>["all"]
>[2];

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

  managementRouter.get(
    ROUTES.SIGNUP_GET,
    "/interaction/signup",
    routes.signupGET,
  );

  managementRouter.post(
    ROUTES.SIGNUP_POST,
    "/interaction/signup",
    routes.signupPOST,
  );

  managementRouter.get(
    ROUTES.PASSWORD_RESET_GET,
    "/interaction/password-reset",
    routes.passwordResetGET,
  );

  managementRouter.post(
    ROUTES.PASSWORD_RESET_POST,
    "/interaction/password-reset",
    routes.passwordResetPOST,
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
