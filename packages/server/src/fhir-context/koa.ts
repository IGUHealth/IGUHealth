import * as db from "zapatos/db";

import { ClientApplication, code } from "@iguhealth/fhir-types/r4/types";

import { EmailProvider } from "../email/interface.js";
import { FHIRServerCTX } from "./context.js";

export type OIDCKoaContext<C> = {
  oidc: {
    client?: ClientApplication;
    parameters: {
      state?: string;
      responseType?: code;
      response_type?: string;
      client_id?: string;
      redirect_uri?: string;
      scope?: string;
    };
  };
} & C;

export type KoaFHIRContext<C> = C &
  OIDCKoaContext<KoaFHIRServicesContext<C>> & {
    FHIRContext: Omit<FHIRServerCTX, "user"> | FHIRServerCTX;
  };

export type KoaFHIRServicesContext<C> = C & {
  emailProvider?: EmailProvider;
  postgres: db.Queryable;
  FHIRContext: Omit<FHIRServerCTX, "user" | "tenant">;
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
