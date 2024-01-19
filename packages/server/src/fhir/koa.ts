import { ClientApplication } from "@iguhealth/fhir-types/r4/types";

import { FHIRServerCTX } from "./context.js";

export type KoaFHIRContext<C> = C & {
  oidc: {
    client?: ClientApplication;
  };
  FHIRContext: Omit<FHIRServerCTX, "user"> | FHIRServerCTX;
};

/**
 * Verifies whether ctx is FHIRServerCTX with user.
 * @param ctx CTX that should be verified as user associated
 * @returns  Verifies whether ctx is FHIRServerCTX with user
 */
export function isFHIRServerAuthorizedUserCTX(
  ctx: FHIRServerCTX | Omit<FHIRServerCTX, "user">,
): ctx is FHIRServerCTX {
  return (ctx as FHIRServerCTX).user !== undefined;
}
