import { createContext } from "react";

import createHTTPClient from "@iguhealth/client/http";
import { AccessToken, IDToken, IDTokenPayload } from "@iguhealth/jwt";

import { OIDC_WELL_KNOWN } from "./reducer";

export type IGUHealthContextState = {
  well_known?: OIDC_WELL_KNOWN;
  getClient: () => ReturnType<typeof createHTTPClient>;
  logout: (redirect: string) => void;
  isAuthenticated: boolean;
  access_token?: AccessToken<string>;
  id_token?: IDToken<string>;
  user?: IDTokenPayload<string>;
};

const stub = (): never => {
  throw new Error("IGUHealth has not been initiated.");
};

export const InitialContext: IGUHealthContextState = {
  getClient: stub,
  logout: stub,
  isAuthenticated: false,
  access_token: undefined,
  id_token: undefined,
  user: undefined,
};

const IGUHealthContext = createContext<IGUHealthContextState>({
  ...InitialContext,
});

export default IGUHealthContext;
