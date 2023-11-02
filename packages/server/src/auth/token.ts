import * as jose from "jose";

export const IGUHEALTH_ISSUER = "https://iguhealth.app/";

export async function createToken(
  privatekey: jose.KeyLike,
  payload: Record<string, unknown>
): Promise<string> {
  if (!process.env.AUTH_JWT_AUDIENCE)
    throw new Error("AUTH_JWT_AUDIENCE is not defined");

  const signedJWT = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setIssuer(IGUHEALTH_ISSUER)
    .setAudience(process.env.AUTH_JWT_AUDIENCE)
    .setExpirationTime("2h")
    .sign(privatekey);

  return signedJWT;
}
// console.log(signedJWT);
// console.log(jose.decodeJwt(signedJWT));
// console.log(await jose.jwtVerify(signedJWT, jwks));
