import { ALGORITHMS, JWTCertificationConfig } from "@iguhealth/jwt";

export function getCertConfig(): JWTCertificationConfig {
  const alg = ALGORITHMS.RS384;
  const kid = process.env.AUTH_LOCAL_SIGNING_KEY;
  switch (process.env.AUTH_CERTIFICATION_TYPE) {
    case "environment": {
      const publicKey = process.env.AUTH_CERTIFICATION_PUBLIC_KEY;
      const privateKey = process.env.AUTH_CERTIFICATION_PRIVATE_KEY;
      if (!publicKey || !privateKey) {
        throw new Error(
          "Missing AUTH_CERTIFICATION_PUBLIC_KEY or AUTH_CERTIFICATION_PRIVATE_KEY",
        );
      }

      return {
        type: "environment",
        publicKey,
        privateKey,
        alg,
        kid,
      };
    }
    case "file": {
      const directory = process.env.AUTH_LOCAL_CERTIFICATION_LOCATION;

      if (!directory) {
        throw new Error("Missing AUTH_CERTIFICATION_DIRECTORY");
      }

      return {
        type: "file",
        directory,
        kid,
        alg,
      };
    }
  }
}
