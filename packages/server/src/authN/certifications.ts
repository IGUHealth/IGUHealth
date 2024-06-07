import * as jose from "jose";
import { KeyObject } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

/**
 * Generates a keypair using the provided algorithm.
 * @param alg
 * @returns privateKey and publicKey generated using jose library.
 */
export async function generateKeyPair(alg: string = "RS256") {
  const { privateKey, publicKey } = await jose.generateKeyPair(alg);
  return { privateKey, publicKey };
}

export const ALGORITHMS = {
  RS256: "RS256",
};

/**
 * Saves certifications as follows:
 * private keys as /${directory}/{kid}.p8 and public keys as /${directory}/{kid}.spki
 * @param directory
 * @param kid
 * @param alg
 * @returns
 */
export async function createCertifications(
  directory: string,
  kid: string,
  alg: string = ALGORITHMS.RS256,
) {
  mkdirSync(directory, { recursive: true });

  const { publicKey, privateKey } = await generateKeyPair(alg);

  const p8PublicKey = await jose.exportSPKI(publicKey);
  const p8Private = await jose.exportPKCS8(privateKey);

  writeFileSync(path.join(directory, `${kid}.spki`), p8PublicKey);
  writeFileSync(path.join(directory, `${kid}.p8`), p8Private);

  return {
    publicKey,
    privateKey,
  };
}

/**
 *
 * @param directory
 * @param alg
 * @returns JSON Web Key Set with all public keys in the directory. Uses filename to distinguish between keys (sets the kid field in the JWK).
 */
export async function getJWKS(
  directory: string,
  alg: string = ALGORITHMS.RS256,
) {
  const publicKeyPaths = readdirSync(directory);
  const keys = await Promise.all(
    publicKeyPaths
      .filter((keyPath) => {
        return keyPath.endsWith(".spki");
      })
      .map(async (pubKeyPath) => {
        const pubKey = await jose.importSPKI(
          readFileSync(path.join(directory, pubKeyPath), "utf-8"),
          alg,
        );

        const kid = path.parse(pubKeyPath).name;
        const pubJWK = await jose.exportJWK(pubKey);

        return { ...pubJWK, alg, use: "sig", kid };
      }),
  );

  return {
    keys,
  };
}

/**
 *
 * @param directory
 * @param kid
 * @param alg
 * @returns Returns the private key for a given kid.
 */
export async function getSigningKey(
  directory: string,
  kid: string,
  alg = ALGORITHMS.RS256,
): Promise<{ key: KeyObject; kid: string }> {
  const privateKeyPath = path.join(directory, `${kid}.p8`);
  const privateKey = await jose.importPKCS8<KeyObject & jose.KeyLike>(
    readFileSync(privateKeyPath, "utf-8"),
    alg,
  );

  return { kid, key: privateKey };
}

export function getCertLocation() {
  return path.resolve(process.env.AUTH_LOCAL_CERTIFICATION_LOCATION);
}

export function getCertKey() {
  return process.env.AUTH_LOCAL_SIGNING_KEY;
}

/**
 * Create certifications if not exist. Saves by default
 * private keys under /${directory}/{kid}.p8 and public keys under /${directory}/{kid}.spki.
 * Should only be used in development environment as these should be injected in environment in prod.
 * @param directory
 * @param kid
 * @param alg
 */
export async function createCertsIfNoneExists(
  directory: string,
  kid: string,
  alg = ALGORITHMS.RS256,
) {
  try {
    await getSigningKey(directory, kid, alg);
  } catch (e) {
    if (!existsSync(directory)) {
      mkdirSync(directory);
    }
    await createCertifications(directory, kid, alg);
  }
}
