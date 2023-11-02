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

async function createJWKSFile(directory: string, fileName: string) {
  const location = path.join(directory, `${fileName}_public.json`);
  mkdirSync(directory, { recursive: true });

  const { privateKey, publicKey } = await jose.generateKeyPair("RS256");

  const publicJWK = await jose.exportJWK(publicKey);
  const pkcs8Private = await jose.exportPKCS8(privateKey);

  const JWKS = { keys: [{ ...publicJWK, use: "sig", alg: "RS256" }] };

  writeFileSync(location, JSON.stringify(JWKS));
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
    console.error(e);
  }

  if (!jwksFile) return createJWKSFile(directory, fileName);

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
