import Router from "@koa/router";
import type * as Koa from "koa";

import { multer } from "@iguhealth/koa-multipart-form";

import { KoaExtensions } from "../../fhir-api/types.js";
import { OIDC_ROUTES } from "../oidc/constants.js";
import { clientInjectFHIRMiddleware } from "../oidc/middleware/client_find.js";
import { createValidateInjectOIDCParameters } from "../oidc/middleware/parameter_inject.js";
import { injectClientCredentialsMiddleware } from "./middleware/inject_client_credentials.js";
import { OAuthErrorHandlingMiddleware } from "./middleware/oauth_error_handling.js";
import * as routes from "./routes/index.js";
import { sessionAuthorizationMiddleware } from "./session/middleware.js";

export type OIDCRouteHandler = Parameters<
  Awaited<ReturnType<typeof createOIDCRouter>>["all"]
>[2];

/**
 * OIDC Router
 */
export async function createOIDCRouter<State extends KoaExtensions.IGUHealth>(
  prefix: string,
  {
    authMiddlewares,
    middleware,
  }: {
    authMiddlewares: Koa.Middleware<State, KoaExtensions.KoaIGUHealthContext>[];
    middleware: Router.Middleware<State, KoaExtensions.KoaIGUHealthContext>[];
  },
) {
  const managementRouter = new Router<State, KoaExtensions.KoaIGUHealthContext>(
    {
      prefix,
    },
  );

  managementRouter.use(...middleware);
  managementRouter.use(sessionAuthorizationMiddleware());

  managementRouter.get(
    OIDC_ROUTES.OIDC_DISCOVERY,
    "/.well-known/openid-configuration",
    routes.wellKnownOpenIDConfiguration(),
  );

  managementRouter.get(
    OIDC_ROUTES.USER_INFO,
    "/auth/userinfo",
    ...authMiddlewares,
    routes.userInfo(),
  );

  managementRouter.post(
    OIDC_ROUTES.USER_INFO,
    "/auth/userinfo",
    ...authMiddlewares,
    routes.userInfo(),
  );

  managementRouter.get(
    OIDC_ROUTES.SIGNUP_GET,
    "/interaction/signup",
    routes.signupGET(),
  );

  managementRouter.post(
    OIDC_ROUTES.SIGNUP_POST,
    "/interaction/signup",
    routes.signupPOST(),
  );

  managementRouter.post(
    OIDC_ROUTES.PASSWORD_RESET_INITIATE_POST,
    "/interaction/password-reset",
    routes.passwordResetInitiatePOST(),
  );

  managementRouter.get(
    OIDC_ROUTES.PASSWORD_RESET_INITIATE_GET,
    "/interaction/password-reset",
    routes.passwordResetInitiateGet(),
  );

  managementRouter.get(
    OIDC_ROUTES.PASSWORD_RESET_VERIFY_GET,
    "/interaction/password-reset-verify",
    routes.passwordResetGET(),
  );

  managementRouter.post(
    OIDC_ROUTES.PASSWORD_RESET_VERIFY_POST,
    "/interaction/password-reset-verify",
    routes.passwordResetPOST(),
  );
  managementRouter.get(
    OIDC_ROUTES.LOGIN_GET,
    "/interaction/login",
    createValidateInjectOIDCParameters({
      required: [
        "client_id",
        "response_type",
        "state",
        "code_challenge",
        "code_challenge_method",
      ],
      optional: ["scope", "redirect_uri"],
    }),
    clientInjectFHIRMiddleware(),
    routes.loginGET(),
  );
  managementRouter.post(
    OIDC_ROUTES.LOGIN_POST,
    "/interaction/login",
    createValidateInjectOIDCParameters({
      required: [
        "client_id",
        "response_type",
        "state",
        "code_challenge",
        "code_challenge_method",
      ],
      optional: ["scope", "redirect_uri"],
    }),
    clientInjectFHIRMiddleware(),
    routes.loginPOST(),
  );
  // Adding both as options to either get or post.

  managementRouter.get(
    OIDC_ROUTES.LOGOUT_GET,
    "/interaction/logout",
    createValidateInjectOIDCParameters({
      required: [],
      optional: ["redirect_uri", "client_id"],
    }),
    clientInjectFHIRMiddleware(),
    routes.logout(),
  );

  managementRouter.post(
    OIDC_ROUTES.LOGOUT_POST,
    "/interaction/logout",
    createValidateInjectOIDCParameters({
      required: [],
      optional: ["redirect_uri", "client_id"],
    }),
    clientInjectFHIRMiddleware(),
    routes.logout(),
  );

  managementRouter.get(
    OIDC_ROUTES.AUTHORIZE_GET,
    "/auth/authorize",
    OAuthErrorHandlingMiddleware(),
    createValidateInjectOIDCParameters({
      required: ["client_id", "response_type", "state", "code_challenge"],
      optional: ["scope", "redirect_uri", "code_challenge_method"],
    }),
    clientInjectFHIRMiddleware(),
    routes.authorize(),
  );

  // managementRouter.post(
  //   OIDC_ROUTES.AUTHORIZE_POST,
  //   "/auth/authorize",
  //   multer().none(),
  //   OAuthErrorHandlingMiddleware(),
  //   createValidateInjectOIDCParameters({
  //     required: ["client_id", "response_type", "state", "code_challenge"],
  //     optional: ["scope", "redirect_uri", "code_challenge_method"],
  //   }),
  //   clientInjectFHIRMiddleware(),
  //   routes.authorize(),
  // );

  managementRouter.post(
    OIDC_ROUTES.AUTHORIZE_POST,
    "/auth/authorize",
    multer().none(),
    OAuthErrorHandlingMiddleware(),
    createValidateInjectOIDCParameters({
      required: ["client_id", "response_type", "state", "code_challenge"],
      optional: ["scope", "redirect_uri", "code_challenge_method"],
    }),
    clientInjectFHIRMiddleware(),
    routes.scopeVerifyPost(),
  );

  managementRouter.post(
    OIDC_ROUTES.TOKEN_POST,
    "/auth/token",
    OAuthErrorHandlingMiddleware(),
    injectClientCredentialsMiddleware(),
    clientInjectFHIRMiddleware(),
    routes.tokenPost(),
  );
  return managementRouter;
}
