import Router from "@koa/router";
import type * as Koa from "koa";
import * as s from "zapatos/schema";

import { KoaContext } from "../../fhir-api/types.js";
import { OIDC_ROUTES } from "../oidc/constants.js";
import {
  clientInjectFHIRMiddleware,
  injectHardcodedClients,
} from "../oidc/middleware/index.js";
import { createValidateInjectOIDCParameters } from "../oidc/middleware/parameter_inject.js";
import * as routes from "./routes/index.js";
import { sessionAuthorizationMiddleware } from "./session/middleware.js";

export type ManagementRouteHandler = Parameters<
  Awaited<ReturnType<typeof createOIDCRouter>>["all"]
>[2];

/**
 * Management api for creating tenants and managing tenant owners.
 */
export async function createOIDCRouter<
  C extends Koa.DefaultContext & KoaContext.OIDC,
>(
  prefix: string,
  {
    authMiddlewares,
    scope,
    middleware,
  }: {
    authMiddlewares: Koa.Middleware<unknown, unknown, unknown>[];
    scope: s.user_scope;
    middleware: Router.Middleware<Koa.DefaultState, C>[];
  },
) {
  const managementRouter = new Router<Koa.DefaultState, C>({
    prefix,
  });

  managementRouter.use(...middleware);
  managementRouter.use(sessionAuthorizationMiddleware());

  managementRouter.get(
    OIDC_ROUTES(scope).OIDC_DISCOVERY,
    "/.well-known/openid-configuration",
    routes.discoveryGet(scope),
  );

  managementRouter.get(
    OIDC_ROUTES(scope).USER_INFO,
    "/auth/userinfo",
    ...authMiddlewares,
    routes.userInfo(scope),
  );

  managementRouter.post(
    OIDC_ROUTES(scope).USER_INFO,
    "/auth/userinfo",
    ...authMiddlewares,
    routes.userInfo(scope),
  );

  managementRouter.get(
    OIDC_ROUTES(scope).SIGNUP_GET,
    "/interaction/signup",
    routes.signupGET(scope),
  );

  managementRouter.post(
    OIDC_ROUTES(scope).SIGNUP_POST,
    "/interaction/signup",
    routes.signupPOST(scope),
  );

  managementRouter.post(
    OIDC_ROUTES(scope).PASSWORD_RESET_INITIATE_POST,
    "/interaction/password-reset",
    routes.passwordResetInitiatePOST(scope),
  );

  managementRouter.get(
    OIDC_ROUTES(scope).PASSWORD_RESET_INITIATE_GET,
    "/interaction/password-reset",
    routes.passwordResetInitiateGet(scope),
  );

  managementRouter.get(
    OIDC_ROUTES(scope).PASSWORD_RESET_VERIFY_GET,
    "/interaction/password-reset-verify",
    routes.passwordResetGET(scope),
  );

  managementRouter.post(
    OIDC_ROUTES(scope).PASSWORD_RESET_VERIFY_POST,
    "/interaction/password-reset-verify",
    routes.passwordResetPOST(scope),
  );
  managementRouter.get(
    OIDC_ROUTES(scope).LOGIN_GET,
    "/interaction/login",
    routes.loginGET(scope),
  );
  managementRouter.post(
    OIDC_ROUTES(scope).LOGIN_POST,
    "/interaction/login",
    routes.loginPOST(scope),
  );
  // Adding both as options to either get or post.

  managementRouter.get(
    OIDC_ROUTES(scope).LOGOUT_GET,
    "/interaction/logout",
    createValidateInjectOIDCParameters({
      required: [],
      optional: ["redirect_uri", "client_id"],
    }),
    injectHardcodedClients(),
    clientInjectFHIRMiddleware(),
    routes.logout(scope),
  );

  managementRouter.post(
    OIDC_ROUTES(scope).LOGOUT_POST,
    "/interaction/logout",
    createValidateInjectOIDCParameters({
      required: [],
      optional: ["redirect_uri", "client_id"],
    }),
    injectHardcodedClients(),
    clientInjectFHIRMiddleware(),
    routes.logout(scope),
  );

  managementRouter.get(
    OIDC_ROUTES(scope).AUTHORIZE_GET,
    "/auth/authorize",
    createValidateInjectOIDCParameters({
      required: ["client_id", "response_type", "state"],
      optional: ["scope", "redirect_uri"],
    }),
    injectHardcodedClients(),
    clientInjectFHIRMiddleware(),
    routes.authorizeGET(scope),
  );

  managementRouter.post(
    OIDC_ROUTES(scope).TOKEN_POST,
    "/auth/token",
    createValidateInjectOIDCParameters({
      required: ["client_id"],
    }),
    injectHardcodedClients(),
    clientInjectFHIRMiddleware(),
    routes.tokenPost(),
  );

  return managementRouter;
}
