import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import * as jose from "jose";

export async function generateKeyPair(alg: string = "RS256") {
  const { privateKey, publicKey } = await jose.generateKeyPair(alg);
  return { privateKey, publicKey };
}

export const ALGORITHMS = {
  RS256: "RS256",
};

/*
 ** Saves certifications as follows:
 ** private keys under /private/{kid}.pkcs8 and public keys under /public/{kid}.spki
 */
export async function createCertifications(
  directory: string,
  kid: string,
  alg: string = ALGORITHMS.RS256
) {
  mkdirSync(path.join(directory, `public`), { recursive: true });
  mkdirSync(path.join(directory, `private`), { recursive: true });

  const { publicKey, privateKey } = await generateKeyPair(alg);

  const pkcs8PublicKey = await jose.exportSPKI(publicKey);
  const pkcs8Private = await jose.exportPKCS8(privateKey);

  writeFileSync(path.join(directory, `public/${kid}.spki`), pkcs8PublicKey);
  writeFileSync(path.join(directory, `private/${kid}.pkcs8`), pkcs8Private);

  return {
    publicKey,
    privateKey,
  };
}

/*
 ** Returns a JSON Web Key Set with all public keys in the directory directory/public.
 ** Uses filename to distinguish between keys (sets the kid field in the JWK).
 */
export async function getJWKS(
  directory: string,
  alg: string = ALGORITHMS.RS256
) {
  //joining path of directory
  const publicDirectory = path.join(directory, "public");
  const publicKeyPaths = readdirSync(publicDirectory);
  const keys = await Promise.all(
    publicKeyPaths.map(async (pubKeyPath) => {
      const pubKey = await jose.importSPKI(
        readFileSync(path.join(publicDirectory, pubKeyPath), "utf-8"),
        alg
      );

      const kid = path.parse(pubKeyPath).name;
      const pubJWK = await jose.exportJWK(pubKey);

      return { ...pubJWK, alg, use: "sig", kid };
    })
  );

  return {
    keys,
  };
}

/*
 ** Returns the private key for a given kid.
 */
export async function getSigningKey(
  directory: string,
  kid: string,
  alg = ALGORITHMS.RS256
) {
  const privateKeyPath = path.join(directory, `private/${kid}.pkcs8`);
  const privateKey = await jose.importPKCS8(
    readFileSync(privateKeyPath, "utf-8"),
    alg
  );

  return { kid, key: privateKey };
}

/*
 ** Create certifications if not exist. Saves by default
 ** private keys under /private/{kid}.pkcs8 and public keys under /public/{kid}.spki.
 ** Should only be used in development environment as these should be injected in environment in prod.
 */
export async function createCertsIfNoneExists(
  directory: string,
  kid: string,
  alg = ALGORITHMS.RS256
) {
  try {
    await getSigningKey(directory, kid, alg);
  } catch (e) {
    await createCertifications(directory, kid, alg);
  }
}
