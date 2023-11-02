import * as jose from "jose";

export const IGUHEALTH_ISSUER = "https://iguhealth.app/";

/**
 * Creates a JWT token using the provided private key and payload.
 */
export async function createToken(
  privatekey: { kid: string; key: jose.KeyLike },
  payload: Record<string, unknown>
): Promise<string> {
  if (!process.env.AUTH_JWT_AUDIENCE)
    throw new Error("AUTH_JWT_AUDIENCE is not defined");

  const signedJWT = await new jose.SignJWT(payload)
    .setProtectedHeader({ kid: privatekey.kid, alg: "RS256" })
    .setIssuedAt()
    .setIssuer(IGUHEALTH_ISSUER)
    .setAudience(process.env.AUTH_JWT_AUDIENCE)
    .setExpirationTime("2h")
    .sign(privatekey.key);

  return signedJWT;
}
