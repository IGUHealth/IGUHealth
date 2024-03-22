import Router from "@koa/router";
import type * as Koa from "koa";
import { KoaPassport } from "koa-passport";
import localStrategy from "passport-local";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../fhir-context/types.js";
import { User } from "../db/users/types.js";
import { OIDC_ROUTES } from "../oidc/constants.js";
import {
  clientInjectFHIRMiddleware,
  injectHardcodedClients,
} from "../oidc/middleware/index.js";
import { createValidateInjectOIDCParameters } from "../oidc/middleware/parameter_inject.js";
import * as routes from "./routes/index.js";

export type ManagementRouteHandler = Parameters<
  ReturnType<typeof createOIDCRouter>["all"]
>[2];

/**
 * Management api for creating tenants and managing tenant owners.
 */
export function createOIDCRouter<
  C extends Koa.DefaultContext & KoaContext.OIDC,
>(
  prefix: string,
  {
    scope,
    client,
    middleware,
  }: {
    scope: s.user_scope;
    client: db.Queryable;
    middleware: Router.Middleware<Koa.DefaultState, C>[];
  },
) {
  const managementRouter = new Router<Koa.DefaultState, C>({
    prefix,
  });

  managementRouter.use(...middleware);

  const koaPassport = new KoaPassport();

  managementRouter.use(async (ctx, next) => {
    koaPassport.serializeUser((euser, done) => {
      const user = euser as unknown as User;
      done(null, { id: user.id });
    });

    koaPassport.deserializeUser(async (info: { id: string }, done) => {
      try {
        const user = await ctx.oidc.userManagement.get(client, info.id);

        if (!user) {
          done(null, false);
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    });
    koaPassport.use(
      new localStrategy.Strategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        async function (username, password, done) {
          try {
            const user = await ctx.oidc.userManagement.login(
              client,
              "email-password",
              {
                email: username,
                password,
              },
            );
            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (e) {
            throw new OperationError(
              outcomeFatal("unknown", "Internal Server Error could not login."),
            );
          }
        },
      ),
    );

    ctx.oidc.passport = koaPassport;
    await next();
  });

  managementRouter.use(koaPassport.initialize());
  managementRouter.use(koaPassport.session());

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
    routes.logout(scope),
  );
  managementRouter.post(
    OIDC_ROUTES(scope).LOGOUT_POST,
    "/interaction/logout",
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
