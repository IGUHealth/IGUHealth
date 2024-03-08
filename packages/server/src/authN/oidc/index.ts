import Router from "@koa/router";
import React from "react";

import { Login } from "@iguhealth/components";

import { KoaContext } from "../../fhir-context/types.js";
import * as views from "../../views/index.js";
import {
  clientInjectFHIRMiddleware,
  createValidateInjectOIDCParameters,
} from "./middleware/index.js";
import * as routes from "./routes/index.js";

/**
 * Creates a router for oidc endpoints.
 * @returns Router for oidc endpoints.
 */
export function createOIDCRouter<State, C>(
  prefix: string,
): Router<State, KoaContext.FHIR<C>> {
  const oidcRouter = new Router<State, KoaContext.FHIR<C>>({
    prefix,
  });

  oidcRouter.get("/interaction/login", (ctx) => {
    views.renderPipe(
      ctx,
      React.createElement(Login, {
        logo: "/public/img/logo.svg",
        action: "#",
      }),
    );
  });

  oidcRouter.post(
    "/token",
    createValidateInjectOIDCParameters({ required: ["client_id"] }),
    clientInjectFHIRMiddleware(),
    routes.tokenEndpoint(),
  );

  return oidcRouter;
}
