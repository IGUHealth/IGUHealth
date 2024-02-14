import Router from "@koa/router";
import type * as Koa from "koa";
import koaPassport from "koa-passport";

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

  managementRouter.use(koaPassport.initialize());
  managementRouter.use(koaPassport.session());
  managementRouter.use(async (ctx, next) => {
    console.log("authMethods:", ctx.isAuthenticated(), ctx.isUnauthenticated());
    return next();
  });

  managementRouter.get(
    ROUTES.SIGNUP_GET,
    "/interaction/signup",
    routes.signupGET,
  );

  managementRouter.post(
    ROUTES.PASSWORD_RESET_INITIATE_POST,
    "/interaction/password-reset",
    routes.passwordResetInitiatePOST,
  );

  managementRouter.get(
    ROUTES.PASSWORD_RESET_INITIATE_GET,
    "/interaction/password-reset",
    routes.passwordResetInitiateGet,
  );

  managementRouter.get(
    ROUTES.PASSWORD_RESET_VERIFY_GET,
    "/interaction/password-reset-verify",
    routes.passwordResetGET,
  );

  managementRouter.post(
    ROUTES.PASSWORD_RESET_VERIFY_POST,
    "/interaction/password-reset-verify",
    routes.passwordResetPOST,
  );
  managementRouter.get(ROUTES.LOGIN_GET, "/interaction/login", routes.loginGet);
  managementRouter.post(
    ROUTES.LOGIN_POST,
    "/interaction/login",
    routes.loginPost,
  );

  return managementRouter;
}
