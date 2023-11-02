import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import * as jose from "jose";

type Output = Promise<{
  publicKey: (
    protectedHeader?: jose.JWSHeaderParameters | undefined,
    token?: jose.FlattenedJWSInput | undefined
  ) => Promise<jose.KeyLike>;
  privateKey: jose.KeyLike;
  jwks: { keys: jose.JWK[] };
}>;

export async function generateKeyPair(alg: string = "RS256") {
  const { privateKey, publicKey } = await jose.generateKeyPair(alg);
  return { privateKey, publicKey };
}

async function createCertifications(
  directory: string,
  fileName: string,
  alg: string = "RS256"
) {
  mkdirSync(directory, { recursive: true });

  const { privateKey, publicKey } = await generateKeyPair(alg);

  const publicJWK = await jose.exportJWK(publicKey);
  const pkcs8Private = await jose.exportPKCS8(privateKey);

  const JWKS = { keys: [{ ...publicJWK, use: "sig", alg }] };

  writeFileSync(
    path.join(directory, `${fileName}_public.json`),
    JSON.stringify(JWKS)
  );
  writeFileSync(
    path.join(directory, `${fileName}_private.pkcs8`),
    pkcs8Private
  );

  return {
    jwks: JWKS,
    publicKey: jose.createLocalJWKSet(JWKS),
    privateKey: privateKey,
  };
}

export async function loadJWKS(directory: string, fileName: string): Output {
  const location = path.join(directory, `${fileName}_public.json`);
  let jwksFile;
  try {
    jwksFile = readFileSync(location, "utf8");
  } catch (e) {
    console.log("NO JWKS FILE FOUND SO CREATING A NEW ONE.");
  }

  if (!jwksFile) return createCertifications(directory, fileName);

  const JWKS = JSON.parse(jwksFile);
  const publicKey = jose.createLocalJWKSet(JWKS);

  return {
    jwks: JWKS,
    publicKey,
    privateKey: await jose.importPKCS8(
      readFileSync(path.join(directory, `${fileName}_private.pkcs8`), "utf8"),
      "RS256"
    ),
  };
}
