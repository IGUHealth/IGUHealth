import { ROUTES } from "../constants.js";
import { ManagementRouteHandler } from "../index.js";
import { setLoginRedirectSession } from "./login.js";

/**
 * See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1.
 * response_type
         REQUIRED.  Value MUST be set to "code".

   client_id
         REQUIRED.  The client identifier as described in Section 2.2.

   redirect_uri
         OPTIONAL.  As described in Section 3.1.2.

   scope
         OPTIONAL.  The scope of the access request as described by
         Section 3.3.

   state
         RECOMMENDED.  An opaque value used by the client to maintain
         state between the request and callback.  The authorization
         server includes this value when redirecting the user-agent back
         to the client.  The parameter SHOULD be used for preventing
         cross-site request forgery as described in Section 10.12.
 * 
 * @param ctx 
 */
export const authorizeGET: ManagementRouteHandler = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.oidc.parameters.client_id;
  } else {
    setLoginRedirectSession(ctx.session, ctx.url);
    ctx.redirect(ctx.router.url(ROUTES.LOGIN_GET) as string);
  }
  await next();
};
