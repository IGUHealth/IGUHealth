import Router from "@koa/router";
import type * as Koa from "koa";
import koaPassport from "koa-passport";
import localStrategy from "passport-local";
import * as db from "zapatos/db";
import { user_scope } from "zapatos/schema";

import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../fhir-context/types.js";
import { User } from "../db/users/types.js";
import { injectHardcodedClients } from "../oidc/middleware/index.js";
import { createValidateInjectOIDCParameters } from "../oidc/middleware/parameter_inject.js";
import { ROUTES } from "./constants.js";
import * as routes from "./routes/index.js";

export type ManagementRouteHandler = Parameters<
  ReturnType<typeof createGlobalRouter>["all"]
>[2];

type Options = {
  client: db.Queryable;
};

/**
 * Management api for creating tenants and managing tenant owners.
 */
export function createGlobalRouter(prefix: string, { client }: Options) {
  const managementRouter = new Router<
    Koa.DefaultState,
    Koa.DefaultContext & KoaContext.OIDC & KoaContext.FHIRServices
  >({
    prefix,
  });

  managementRouter.use(async (ctx, next) => {
    koaPassport.serializeUser((euser, done) => {
      const user = euser as unknown as User;
      done(null, { id: user.id });
    });

    koaPassport.deserializeUser(
      async (info: { scope: user_scope; id: string; tenant: string }, done) => {
        try {
          const user = await ctx.oidc.userManagement.get(client, info.id);
          done(null, user);
        } catch (err) {
          done(err);
        }
      },
    );
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
              "password",
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
    await next();
  });
  managementRouter.use(koaPassport.initialize());
  managementRouter.use(koaPassport.session());

  managementRouter.get(
    ROUTES.SIGNUP_GET,
    "/interaction/signup",
    routes.signupGET,
  );

  managementRouter.post(
    ROUTES.PASSWORD_RESET_INITIATE_POST,
    "/interaction/password-reset",
    routes.passwordResetInitiatePOST(),
  );

  managementRouter.get(
    ROUTES.PASSWORD_RESET_INITIATE_GET,
    "/interaction/password-reset",
    routes.passwordResetInitiateGet,
  );

  managementRouter.get(
    ROUTES.PASSWORD_RESET_VERIFY_GET,
    "/interaction/password-reset-verify",
    routes.passwordResetGET(),
  );

  managementRouter.post(
    ROUTES.PASSWORD_RESET_VERIFY_POST,
    "/interaction/password-reset-verify",
    routes.passwordResetPOST(),
  );
  managementRouter.get(ROUTES.LOGIN_GET, "/interaction/login", routes.loginGET);
  managementRouter.post(
    ROUTES.LOGIN_POST,
    "/interaction/login",
    routes.loginPOST,
  );
  managementRouter.get(
    ROUTES.AUTHORIZE_GET,
    "/auth/authorize",
    createValidateInjectOIDCParameters({
      required: ["client_id", "response_type", "state"],
      optional: ["scope", "redirect_uri"],
    }),
    injectHardcodedClients(),
    routes.authorizeGET(),
  );
  managementRouter.post(
    ROUTES.TOKEN_POST,
    "/auth/token",
    createValidateInjectOIDCParameters({
      required: ["client_id"],
    }),
    injectHardcodedClients(),
    routes.tokenPost(),
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
