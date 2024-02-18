import Router from "@koa/router";
import type * as Koa from "koa";
import koaPassport from "koa-passport";
import localStrategy from "passport-local";
import * as db from "zapatos/db";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import {
  KoaFHIRServicesContext,
  OIDCKoaContext,
} from "../../fhir-context/koa.js";
import { createValidateInjectOIDCParameters } from "../oidc/middleware/parameter_inject.js";
import { ROUTES } from "./constants.js";
import * as dbUser from "./db/user.js";
import * as routes from "./routes/index.js";

export type ManagementRouteHandler = Parameters<
  ReturnType<typeof createManagementRouter>["all"]
>[2];

type Options = {
  client: db.Queryable;
};

/**
 * Management api for creating tenants and managing tenant owners.
 */
export function createManagementRouter(prefix: string, { client }: Options) {
  const managementRouter = new Router<
    Koa.DefaultState,
    OIDCKoaContext<KoaFHIRServicesContext<Koa.DefaultContext>>
  >({
    prefix,
  });

  koaPassport.use(
    new localStrategy.Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (username, password, done) {
        try {
          dbUser.login(client, username, password).then((user) => {
            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
          });
        } catch (e) {
          throw new OperationError(
            outcomeFatal("unknown", "Internal Server Error could not login."),
          );
        }
      },
    ),
  );

  koaPassport.serializeUser((user, done) => {
    done(null, (user as unknown as dbUser.User).email);
  });

  koaPassport.deserializeUser(async (email: string, done) => {
    try {
      const user = await dbUser.findManagementUserByEmail(client, email);
      done(null, user);
    } catch (err) {
      done(err);
    }
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
  managementRouter.get(ROUTES.LOGIN_GET, "/interaction/login", routes.loginGET);
  managementRouter.post(
    ROUTES.LOGIN_POST,
    "/interaction/login",
    routes.loginPOST,
  );
  managementRouter.get(
    ROUTES.AUTHORIZE_GET,
    "/interaction/authorize",
    createValidateInjectOIDCParameters({
      required: ["client_id", "response_type", "state"],
      optional: ["scope", "redirect_uri"],
    }),
    routes.authorizeGET,
  );

  // Adding both as options to either get or post.
  managementRouter.get(ROUTES.LOGOUT_GET, "/interaction/logout", routes.logout);
  managementRouter.post(
    ROUTES.LOGOUT_POST,
    "/interaction/logout",
    routes.logout,
  );

  return managementRouter;
}
