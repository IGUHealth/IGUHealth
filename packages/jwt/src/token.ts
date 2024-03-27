import * as jose from "jose";

import { IGUHEALTH_AUDIENCE, IGUHEALTH_ISSUER } from "./constants.js";
import { JWT } from "./types.js";

export function parseJwt<A, Token extends JWT<A>>(
  token: Token,
): Token["payload"] {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

/**
 * Creates a JWT token using the provided private key and payload.
 */
export async function createToken<Payload>(
  privatekey: { kid: string; key: jose.KeyLike },
  payload: Payload,
  expiresIn = "2h",
): Promise<JWT<Payload>> {
  const signedJWT = (await new jose.SignJWT({
    ...payload,
    iss: IGUHEALTH_ISSUER,
    aud: IGUHEALTH_AUDIENCE,
  })
    .setProtectedHeader({ kid: privatekey.kid, alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(privatekey.key)) as JWT<Payload & { iss: string; aud: string }>;

  return signedJWT;
}
