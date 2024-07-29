import Router from "@koa/router";

import { KoaExtensions } from "../../../fhir-api/types.js";
import { JWKS_GET, OIDC_ROUTES, getIssuer } from "../constants.js";
import { OIDCRouteHandler } from "../index.js";

type OIDCDiscoveryDocument = {
  /**
   * REQUIRED. URL using the https scheme with no query or fragment components that the OP asserts as its Issuer Identifier. If Issuer discovery is supported (see Section 2), this value MUST be identical to the issuer value returned by WebFinger. This also MUST be identical to the iss Claim value in ID Tokens issued from this Issuer.
   */
  issuer: string;
  /**
   * REQUIRED. URL of the OP's OAuth 2.0 Authorization Endpoint [OpenID.Core]. This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
   */
  authorization_endpoint: string;
  /**
   * URL of the OP's OAuth 2.0 Token Endpoint [OpenID.Core]. This is REQUIRED unless only the Implicit Flow is used. This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
   */
  token_endpoint: string;
  /**
   * RECOMMENDED. URL of the OP's UserInfo Endpoint [OpenID.Core]. This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
   */
  userinfo_endpoint?: string;
  /**
   * REQUIRED. URL of the OP's JWK Set [JWK] document, which MUST use the https scheme. This contains the signing key(s) the RP uses to validate signatures from the OP. The JWK Set MAY also contain the Server's encryption key(s), which are used by RPs to encrypt requests to the Server. When both signing and encryption keys are made available, a use (public key use) parameter value is REQUIRED for all keys in the referenced JWK Set to indicate each key's intended usage. Although some algorithms allow the same key to be used for both signatures and encryption, doing so is NOT RECOMMENDED, as it is less secure. The JWK x5c parameter MAY be used to provide X.509 representations of keys provided. When used, the bare key values MUST still be present and MUST match those in the certificate. The JWK Set MUST NOT contain private or symmetric key values.
   */
  jwks_uri: string;
  /**
   * RECOMMENDED. URL of the OP's Dynamic Client Registration Endpoint [OpenID.Registration], which MUST use the https scheme.
   */
  registration_endpoint?: string;
  /**
   * RECOMMENDED. JSON array containing a list of the OAuth 2.0 [RFC6749] scope values that this server supports. The server MUST support the openid scope value. Servers MAY choose not to advertise some supported scope values even when this parameter is used, although those defined in [OpenID.Core] SHOULD be listed, if supported.
   */
  scopes_supported?: string[];
  /**
   * REQUIRED. JSON array containing a list of the OAuth 2.0 response_type values that this OP supports. Dynamic OpenID Providers MUST support the code, id_token, and the id_token token Response Type values.
   */
  response_types_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the OAuth 2.0 response_mode values that this OP supports, as specified in OAuth 2.0 Multiple Response Type Encoding Practices [OAuth.Responses]. If omitted, the default for Dynamic OpenID Providers is ["query", "fragment"].
   */
  response_modes_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the OAuth 2.0 Grant Type values that this OP supports. Dynamic OpenID Providers MUST support the authorization_code and implicit Grant Type values and MAY support other Grant Types. If omitted, the default value is ["authorization_code", "implicit"].
   */
  grant_types_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the Authentication Context Class References that this OP supports.
   */
  acr_values_supported?: string[];
  /**
   * REQUIRED. JSON array containing a list of the Subject Identifier types that this OP supports. Valid types include pairwise and public.
   */
  subject_types_supported: string[];
  /**
   * REQUIRED. JSON array containing a list of the JWS signing algorithms (alg values) supported by the OP for the ID Token to encode the Claims in a JWT [JWT]. The algorithm RS256 MUST be included. The value none MAY be supported but MUST NOT be used unless the Response Type used returns no ID Token from the Authorization Endpoint (such as when using the Authorization Code Flow).
   */
  id_token_signing_alg_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWE encryption algorithms (alg values) supported by the OP for the ID Token to encode the Claims in a JWT [JWT].
   */
  id_token_encryption_alg_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWE encryption algorithms (enc values) supported by the OP for the ID Token to encode the Claims in a JWT [JWT].
   */
  id_token_encryption_enc_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWS [JWS] signing algorithms (alg values) [JWA] supported by the UserInfo Endpoint to encode the Claims in a JWT [JWT]. The value none MAY be included.
   */
  userinfo_signing_alg_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWE [JWE] encryption algorithms (alg values) [JWA] supported by the UserInfo Endpoint to encode the Claims in a JWT [JWT].
   */
  userinfo_encryption_alg_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWE encryption algorithms (enc values) [JWA] supported by the UserInfo Endpoint to encode the Claims in a JWT [JWT].
   */
  userinfo_encryption_enc_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWS signing algorithms (alg values) supported by the OP for Request Objects, which are described in Section 6.1 of OpenID Connect Core 1.0 [OpenID.Core]. These algorithms are used both when the Request Object is passed by value (using the request parameter) and when it is passed by reference (using the request_uri parameter). Servers SHOULD support none and RS256.
   */
  request_object_signing_alg_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWE encryption algorithms (alg values) supported by the OP for Request Objects. These algorithms are used both when the Request Object is passed by value and when it is passed by reference.
   */
  request_object_encryption_alg_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWE encryption algorithms (enc values) supported by the OP for Request Objects. These algorithms are used both when the Request Object is passed by value and when it is passed by reference.
   */
  request_object_encryption_enc_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of Client Authentication methods supported by this Token Endpoint. The options are client_secret_post, client_secret_basic, client_secret_jwt, and private_key_jwt, as described in Section 9 of OpenID Connect Core 1.0 [OpenID.Core]. Other authentication methods MAY be defined by extensions. If omitted, the default is client_secret_basic -- the HTTP Basic Authentication Scheme specified in Section 2.3.1 of OAuth 2.0 [RFC6749].
   */
  token_endpoint_auth_methods_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the JWS signing algorithms (alg values) supported by the Token Endpoint for the signature on the JWT [JWT] used to authenticate the Client at the Token Endpoint for the private_key_jwt and client_secret_jwt authentication methods. Servers SHOULD support RS256. The value none MUST NOT be used.
   */
  token_endpoint_auth_signing_alg_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the display parameter values that the OpenID Provider supports. These values are described in Section 3.1.2.1 of OpenID Connect Core 1.0 [OpenID.Core].
   */
  display_values_supported?: string[];
  /**
   * OPTIONAL. JSON array containing a list of the Claim Types that the OpenID Provider supports. These Claim Types are described in Section 5.6 of OpenID Connect Core 1.0 [OpenID.Core]. Values defined by this specification are normal, aggregated, and distributed. If omitted, the implementation supports only normal Claims.
   */
  claim_types_supported?: string[];
  /**
   * RECOMMENDED. JSON array containing a list of the Claim Names of the Claims that the OpenID Provider MAY be able to supply values for. Note that for privacy or other reasons, this might not be an exhaustive list.
   */
  claims_supported?: string[];
  /**
   * OPTIONAL. URL of a page containing human-readable information that developers might want or need to know when using the OpenID Provider. In particular, if the OpenID Provider does not support Dynamic Client Registration, then information on how to register Clients needs to be provided in this documentation.
   */
  service_documentation?: string;
  /**
   * OPTIONAL. Languages and scripts supported for values in Claims being returned, represented as a JSON array of BCP47 [RFC5646] language tag values. Not all languages and scripts are necessarily supported for all Claim values.
   */
  claims_locales_supported?: string[];
  /**
   * OPTIONAL. Languages and scripts supported for the user interface, represented as a JSON array of BCP47 [RFC5646] language tag values.
   */
  ui_locales_supported?: string[];
  /**
   * OPTIONAL. Boolean value specifying whether the OP supports use of the claims parameter, with true indicating support. If omitted, the default value is false.
   */
  claims_parameter_supported?: boolean;
  /**
   * OPTIONAL. Boolean value specifying whether the OP supports use of the request parameter, with true indicating support. If omitted, the default value is false.
   */
  request_parameter_supported?: boolean;
  /**
   * OPTIONAL. Boolean value specifying whether the OP supports use of the request_uri parameter, with true indicating support. If omitted, the default value is true.
   */
  request_uri_parameter_supported?: boolean;
  /**
   * OPTIONAL. Boolean value specifying whether the OP requires any request_uri values used to be pre-registered using the request_uris registration parameter. Pre-registration is REQUIRED when the value is true. If omitted, the default value is false.
   */
  require_request_uri_registration?: boolean;
  /**
   * OPTIONAL. URL that the OpenID Provider provides to the person registering the Client to read about the OP's requirements on how the Relying Party can use the data provided by the OP. The registration process SHOULD display this URL to the person registering the Client if it is given.
   */
  op_policy_uri?: string;
  /**
   * OPTIONAL. URL that the OpenID Provider provides to the person registering the Client to read about the OpenID Provider's terms of service. The registration process SHOULD display this URL to the person registering the Client if it is given.
   */
  op_tos_uri?: string;
};

type WellKnownSmartConfiguration = {
  /**
   * CONDITIONAL, String conveying this system’s OpenID Connect Issuer URL.
   * Required if the server’s capabilities include sso-openid-connect; otherwise, omitted.
   */
  issuer?: string;
  /**
   * CONDITIONAL, String conveying this system’s JSON Web Key Set URL.
   * Required if the server’s capabilities include sso-openid-connect; otherwise, optional.
   */
  jwks_uri?: string;
  /**
   * CONDITIONAL, URL to the OAuth2 authorization endpoint.
   * Required if server supports the launch-ehr or launch-standalone capability; otherwise, optional.
   */
  authorization_endpoint?: string;
  /**
   * REQUIRED, Array of grant types supported at the token endpoint.
   * The options are “authorization_code” (when SMART App Launch is supported)
   * and “client_credentials” (when SMART Backend Services is supported).
   */
  grant_types_supported: string[];
  /**
   * REQUIRED, URL to the OAuth2 token endpoint.
   */
  token_endpoint: string;
  /**
   * OPTIONAL, array of client authentication methods supported by the token endpoint.
   * The options are “client_secret_post”, “client_secret_basic”, and “private_key_jwt”.
   */
  token_endpoint_auth_methods_supported?: string[];
  /**
   * OPTIONAL, If available, URL to the OAuth2 dynamic registration endpoint for this FHIR server.
   */
  registration_endpoint?: string;
  /**
   * OPTIONAL, Array of objects for endpoints that share the same authorization mechanism as this FHIR endpoint,
   * each with a “url” and “capabilities” array. This property is deemed experimental.
   */
  associated_endpoints?: { url?: string; capabilities?: string }[];
  /**
   * RECOMMENDED, URL for a Brand Bundle. See User Access Brands.
   */
  user_access_brand_bundle?: string;
  /**
   * RECOMMENDED, Identifier for the primary entry in a Brand Bundle. See User Access Brands.
   */
  user_access_brand_identifier?: string;
  /**
   * Array of scopes a client may request. See scopes and launch context.
   * The server SHALL support all scopes listed here; additional scopes MAY be supported
   * (so clients should not consider this an exhaustive list).
   */
  scopes_supported?: string[];
  /**
   * RECOMMENDED, URL where an end-user can view which applications currently have access
   * to data and can make adjustments to these access rights.
   */
  management_endpoint?: string;
  /**
   * RECOMMENDED, URL to a server’s introspection endpoint that can be used to validate a token.
   */
  introspection_endpoint?: string;
  /**
   * RECOMMENDED, URL to a server’s revoke endpoint that can be used to revoke a token.
   */
  revocation_endpoint?: string;
  /**
   * REQUIRED, Array of strings representing SMART capabilities
   * (e.g., sso-openid-connect or launch-standalone) that the server supports.
   */
  capabilities: string[];
  /**
   * REQUIRED, Array of PKCE code challenge methods supported.
   * The S256 method SHALL be included in this list, and the plain method SHALL NOT be included in this list.
   */
  code_challenge_methods_supported: string[];
};

export function wellKnownOpenIDConfiguration(): OIDCRouteHandler {
  return async (ctx) => {
    const OIDC_DISCOVERY_DOCUMENT: OIDCDiscoveryDocument = {
      issuer: getIssuer(ctx.state.iguhealth.tenant),
      userinfo_endpoint: new URL(
        ctx.router.url(OIDC_ROUTES.USER_INFO, {
          tenant: ctx.state.iguhealth.tenant,
        }) as string,
        process.env.API_URL,
      ).href,

      token_endpoint: new URL(
        ctx.router.url(OIDC_ROUTES.TOKEN_POST, {
          tenant: ctx.state.iguhealth.tenant,
        }) as string,
        process.env.API_URL,
      ).href,

      authorization_endpoint: new URL(
        ctx.router.url(OIDC_ROUTES.AUTHORIZE_GET, {
          tenant: ctx.state.iguhealth.tenant,
        }) as string,
        process.env.API_URL,
      ).href,

      jwks_uri: new URL(ctx.router.url(JWKS_GET) as string, process.env.API_URL)
        .href,

      response_types_supported: ["code", "id_token", "id_token token"],
      token_endpoint_auth_methods_supported: [
        "client_secret_basic",
        "client_secret_post",
      ],
      id_token_signing_alg_values_supported: ["RS256"],
      subject_types_supported: ["public"],
    };

    ctx.body = OIDC_DISCOVERY_DOCUMENT;
  };
}

export function wellKnownSmartGET<State extends KoaExtensions.IGUHealth>(
  oidcRouter: Router<State, KoaExtensions.KoaIGUHealthContext>,
): OIDCRouteHandler {
  return async (ctx) => {
    const WELL_KNOWN_SMART_CONFIGURATION: WellKnownSmartConfiguration = {
      issuer: getIssuer(ctx.state.iguhealth.tenant),
      grant_types_supported: ["authorization_code", "client_credentials"],
      token_endpoint: new URL(
        oidcRouter.url(OIDC_ROUTES.TOKEN_POST, {
          tenant: ctx.state.iguhealth.tenant,
        }) as string,
        process.env.API_URL,
      ).href,

      authorization_endpoint: new URL(
        oidcRouter.url(OIDC_ROUTES.AUTHORIZE_GET, {
          tenant: ctx.state.iguhealth.tenant,
        }) as string,
        process.env.API_URL,
      ).href,
      jwks_uri: new URL(oidcRouter.url(JWKS_GET) as string, process.env.API_URL)
        .href,
      token_endpoint_auth_methods_supported: [
        "client_secret_basic",
        "client_secret_post",
      ],
      capabilities: [
        "sso-openid-connect",
        "launch-standalone",
        "client-confidential-symmetric",
        "client-public",
        "authorize-post",
      ],
      code_challenge_methods_supported: ["S256"],
    };

    ctx.body = WELL_KNOWN_SMART_CONFIGURATION;
  };
}
