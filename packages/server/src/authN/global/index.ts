import Router from "@koa/router";
import Koa from "koa";

import { KoaContext } from "../../fhir-api/types.js";
import { ROUTES } from "./constants.js";
import * as routes from "./routes/index.js";

export type ManagementRouteHandler = Parameters<
  Awaited<ReturnType<typeof globalAuthRouter>>["all"]
>[2];

/**
 * Global signup for creating users and directing to tenants.
 */
export async function globalAuthRouter<
  C extends Koa.DefaultContext & KoaContext.FHIRServices,
>(
  prefix: string,
  {
    middleware,
  }: {
    middleware: Router.Middleware<Koa.DefaultState, C>[];
  },
) {
  const globalAuthRouter = new Router<Koa.DefaultState, C>({
    prefix,
  });

  globalAuthRouter.use(...middleware);

  globalAuthRouter.get(
    ROUTES.SIGNUP,
    "/signup",

    routes.signupGET(),
  );

  return globalAuthRouter;
}
