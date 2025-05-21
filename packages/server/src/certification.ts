import { ALGORITHMS, JWTCertificationConfig } from "@iguhealth/jwt";

import { ConfigProvider } from "./config/provider/interface.js";

export function getCertConfig(config: ConfigProvider): JWTCertificationConfig {
  const alg = ALGORITHMS.RS384;
  const kid = config.get("AUTH_LOCAL_SIGNING_KEY");
  const certificateType = config.get("AUTH_CERTIFICATION_TYPE");

  switch (certificateType) {
    case "environment": {
      const publicKey = config.get("AUTH_CERTIFICATION_PUBLIC_KEY");
      const privateKey = config.get("AUTH_CERTIFICATION_PRIVATE_KEY");
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
      const directory = config.get("AUTH_LOCAL_CERTIFICATION_LOCATION");

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
