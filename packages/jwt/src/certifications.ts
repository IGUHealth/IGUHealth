import * as jose from "jose";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import { ALGORITHMS, ALGORITHMS_ALLOWED } from "./constants.js";

/**
 * Generates a keypair using the provided algorithm.
 * @param alg
 * @returns privateKey and publicKey generated using jose library.
 */
export async function generateKeyPair(
  alg: ALGORITHMS_ALLOWED,
  options: { extractable: boolean },
) {
  const { privateKey, publicKey } = await jose.generateKeyPair(alg, options);
  return { privateKey, publicKey };
}

/**
 * Saves certifications as follows:
 * private keys as /${directory}/{kid}.p8 and public keys as /${directory}/{kid}.spki
 * @param directory
 * @param kid
 * @param alg
 * @returns
 */
export async function createCertifications(
  alg: ALGORITHMS_ALLOWED,
  directory: string,
  kid: string,
) {
  mkdirSync(directory, { recursive: true });

  const { publicKey, privateKey } = await generateKeyPair(alg, {
    extractable: true,
  });

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
  alg: string = ALGORITHMS.RS384,
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
  alg: ALGORITHMS_ALLOWED = ALGORITHMS.RS384,
): Promise<{ key: CryptoKey; kid: string }> {
  const privateKeyPath = path.join(directory, `${kid}.p8`);
  const privateKey = await jose.importPKCS8(
    readFileSync(privateKeyPath, "utf-8"),
    alg,
  );

  return { kid, key: privateKey };
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
  alg: ALGORITHMS_ALLOWED = ALGORITHMS.RS384,
) {
  try {
    await getSigningKey(directory, kid, alg);
  } catch (_e) {
    if (!existsSync(directory)) {
      mkdirSync(directory);
    }
    await createCertifications(alg, directory, kid);
  }
}
