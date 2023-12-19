import * as jose from "jose";

export const IGUHEALTH_ISSUER = "https://iguhealth.app/";

/**
 * Creates a JWT token using the provided private key and payload.
 */
export async function createToken(
  privatekey: { kid: string; key: jose.KeyLike },
  keyData: {
    header: { audience: string };
    payload: Record<string, unknown>;
  }
): Promise<string> {
  const signedJWT = await new jose.SignJWT(keyData.payload)
    .setProtectedHeader({ kid: privatekey.kid, alg: "RS256" })
    .setIssuedAt()
    .setIssuer(IGUHEALTH_ISSUER)
    .setAudience(keyData.header.audience)
    .setExpirationTime("2h")
    .sign(privatekey.key);

  return signedJWT;
}
