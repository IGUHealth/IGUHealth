import * as Koa from "koa";

import { KoaExtensions } from "../../../fhir-api/types.js";

type OIDCErrorType =
  // The request is missing a required parameter, includes an invalid parameter value, or is otherwise malformed.
  | "invalid_request"
  // The client is not authorized to request an authorization code using this method.
  | "unauthorized_client"
  // The authorization server does not support obtaining an authorization code using this method.
  | "unsupported_response_type"
  // The requested scope is invalid, unknown, or malformed.
  | "invalid_scope"
  // The authorization server encountered an unexpected condition which prevented it from fulfilling the request.
  | "server_error"
  // The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server.
  | "temporarily_unavailable"
  // The user has denied access to the client.
  | "access_denied";

export class OIDCError extends Error {
  private error;
  private error_description;
  private error_uri;
  private state;
  private redirect_uri;
  constructor({
    error,
    error_description,
    error_uri,
    state,
    redirect_uri,
  }: {
    error: OIDCErrorType;
    error_description: string;
    error_uri?: string;
    state?: string;
    redirect_uri?: string;
  }) {
    super();
    this.error = error;
    this.error_description = error_description;
    this.error_uri = error_uri;
    this.state = state;
    this.redirect_uri = redirect_uri;
  }

  getRedirectionUrl() {
    let redirect_url = `${this.redirect_uri}?error=${this.error}&error_description=${this.error_description}`;

    if (this.error_uri) {
      redirect_url = `${redirect_url}&error_uri=${this.error_uri}`;
    }
    if (this.state) {
      redirect_url = `${redirect_url}&state=${this.state}`;
    }

    return redirect_url;
  }
}

/**
 * Middleware to handle errors thrown by the OIDC routes. This middleware will catch the error and redirect the user to the appropriate error page based on their redirect_uri.
 * @returns Koa.Middleware
 */
export function OAuthErrorHandlingMiddleware(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      switch (true) {
        case err instanceof OIDCError: {
          ctx.redirect(err.getRedirectionUrl());
          return;
        }
        default: {
          throw err;
        }
      }
    }
  };
}
