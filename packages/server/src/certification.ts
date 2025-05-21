import { ALGORITHMS, JWTCertificationConfig } from "@iguhealth/jwt";

import { ConfigProvider } from "./config/provider/interface.js";

export async function getCertConfig(
  config: ConfigProvider,
): Promise<JWTCertificationConfig> {
  const alg = ALGORITHMS.RS384;
  const kid = await config.get("AUTH_LOCAL_SIGNING_KEY");
  const certificateType = await config.get("AUTH_CERTIFICATION_TYPE");

  switch (certificateType) {
    case "environment": {
      const publicKey = await config.get("AUTH_CERTIFICATION_PUBLIC_KEY");
      const privateKey = await config.get("AUTH_CERTIFICATION_PRIVATE_KEY");
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
      const directory = await config.get("AUTH_LOCAL_CERTIFICATION_LOCATION");

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
