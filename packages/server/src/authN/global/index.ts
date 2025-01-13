import Router from "@koa/router";

import { KoaExtensions } from "../../fhir-server/types.js";
import { ROUTES } from "./constants.js";
import * as routes from "./routes/index.js";

export type GlobalAuthRouteHandler = Parameters<
  Awaited<ReturnType<typeof createGlobalAuthRouter>>["all"]
>[2];

/**
 * Global signup for creating users and directing to tenants.
 */
export async function createGlobalAuthRouter(
  prefix: string,
  {
    middleware,
  }: {
    middleware: Router.Middleware<
      KoaExtensions.IGUHealthServices,
      KoaExtensions.KoaIGUHealthContext,
      unknown
    >[];
  },
) {
  const globalAuthRouter = new Router<
    KoaExtensions.IGUHealthServices,
    KoaExtensions.KoaIGUHealthContext
  >({
    prefix,
  });

  globalAuthRouter.use(...middleware);

  globalAuthRouter.get(ROUTES.SIGNUP_GET, "/signup", routes.signupGET());
  globalAuthRouter.post(ROUTES.SIGNUP_POST, "/signup", routes.signupPOST());
  globalAuthRouter.get(ROUTES.LOGIN_GET, "/login", routes.loginGET());
  globalAuthRouter.post(ROUTES.LOGIN_POST, "/login", routes.loginPOST());

  return globalAuthRouter;
}
