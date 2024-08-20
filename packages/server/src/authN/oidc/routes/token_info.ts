import Ajv from "ajv";
import { jwtVerify } from "jose";
import { JWSInvalid } from "jose/errors";
import { user_role } from "zapatos/schema";

import {
  AccessTokenPayload,
  IDTokenPayload,
  SMARTPayload,
} from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import {
  getCertKey,
  getCertLocation,
  getSigningKey,
} from "../../certifications.js";
import { getIssuer } from "../constants.js";
import { OIDCRouteHandler } from "../index.js";
import { OAuth2TokenIntrospectionBody } from "../schemas/oauth2_token_introspection.schema.js";
import OAuth2TokenIntrospectionBodySchema from "../schemas/oauth2_token_introspection.schema.json" with { type: "json" };

function verifyTokenIntrospectionBody(
  body: unknown,
): body is OAuth2TokenIntrospectionBody {
  const ajv = new Ajv.default({});
  const tokenBodyValidator = ajv.compile(OAuth2TokenIntrospectionBodySchema);

  const result = tokenBodyValidator(body);
  return result;
}

/**
 * Token introspection response.
 * Details pulled from https://datatracker.ietf.org/doc/html/rfc7662#section-2.2
 */
type TokenInfoResponse = {
  /**
   * REQUIRED.  Boolean indicator of whether or not the presented token
   * is currently active.  The specifics of a token's "active" state
   * will vary depending on the implementation of the authorization
   * server and the information it keeps about its tokens, but a "true"
   * value return for the "active" property will generally indicate
   * that a given token has been issued by this authorization server,
   * has not been revoked by the resource owner, and is within its
   * given time window of validity (e.g., after its issuance time and
   * before its expiration time).  See Section 4 for information on
   * implementation of such checks.
   */
  active: boolean;
  /**
   * OPTIONAL.  A JSON string containing a space-separated list of
   * scopes associated with this token, in the format described in
   * Section 3.3 of OAuth 2.0 [RFC6749].
   */
  scope?: string;
  /**
   * OPTIONAL.  Client identifier for the OAuth 2.0 client that
   * requested this token.
   */
  client_id?: string;
  /**
   * OPTIONAL.  Human-readable identifier for the resource owner who
   * authorized this token.
   */
  username?: string;
  /**
   * OPTIONAL.  Type of the token as defined in Section 5.1 of OAuth
   * 2.0 [RFC6749].
   */
  token_type?: string;
  /**
   * OPTIONAL.  Integer timestamp, measured in the number of seconds
   * since January 1 1970 UTC, indicating when this token will expire,
   * as defined in JWT [RFC7519].
   */
  exp?: number;
  /**
   * OPTIONAL.  Integer timestamp, measured in the number of seconds
   * since January 1 1970 UTC, indicating when this token was
   * originally issued, as defined in JWT [RFC7519].
   */
  iat?: number;
  /**
   * OPTIONAL.  Integer timestamp, measured in the number of seconds
   * since January 1 1970 UTC, indicating when this token is not to be
   * used before, as defined in JWT [RFC7519].
   */
  nbf?: number;
  /**
   * OPTIONAL.  Subject of the token, as defined in JWT [RFC7519].
   * Usually a machine-readable identifier of the resource owner who
   * authorized this token.
   */
  sub?: string;
  /**
   * OPTIONAL.  Service-specific string identifier or list of string
   * identifiers representing the intended audience for this token, as
   * defined in JWT [RFC7519].
   */
  aud?: string;
  /**
   * OPTIONAL.  String representing the issuer of this token, as
   * defined in JWT [RFC7519].
   */
  iss?: string;
  /**
   * OPTIONAL.  String identifier for the token, as defined in JWT
   * [RFC7519].
   */
  jti?: string;

  /**
   * SMART Claims for fhirUser.
   */
  fhirUser?: string;
};

export function tokenInfo(): OIDCRouteHandler {
  return async (ctx) => {
    const body = ctx.request.body;

    if (!verifyTokenIntrospectionBody(body)) {
      throw new OperationError(
        outcomeError("invalid", "Invalid token introspection body."),
      );
    }

    const signingKey = await getSigningKey(getCertLocation(), getCertKey());
    try {
      const result = await jwtVerify<
        | AccessTokenPayload<user_role>
        | SMARTPayload<user_role>
        | IDTokenPayload<user_role>
      >(body.token, signingKey.key, {
        issuer: getIssuer(ctx.state.iguhealth.tenant),
        algorithms: ["RS256"],
      });

      ctx.status = 200;
      ctx.body = {
        active: (result.payload.exp ?? 0) > Date.now() / 1000,
        iss: result.payload.iss,
        client_id: result.payload.aud,
        username: result.payload.sub,
        sub: result.payload.sub,
        iat: result.payload.iat,
        exp: result.payload.exp,
        scope: result.payload.scope,
        aud: result.payload.aud,
        fhirUser: result.payload.fhirUser,
      } as TokenInfoResponse;
    } catch (e) {
      if (e instanceof JWSInvalid) {
        ctx.status = 200;
        ctx.body = {
          active: false,
        } as TokenInfoResponse;
      } else {
        throw e;
      }
    }
  };
}
