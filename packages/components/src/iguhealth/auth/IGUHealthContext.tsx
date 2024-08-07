import { createContext } from "react";

import { AccessToken, IDToken, IDTokenPayload } from "@iguhealth/jwt";

import { OIDC_WELL_KNOWN } from "./reducer";

export type AccessTokenResponse = {
  access_token: AccessToken<string>;
  id_token: IDToken<string>;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
};

export type IGUHealthContextState = {
  rootURL?: string;
  well_known_uri?: string;
  well_known?: OIDC_WELL_KNOWN;
  logout: (redirect: string) => void;
  isAuthenticated: boolean;
  payload?: AccessTokenResponse;
  user?: IDTokenPayload<string>;
  loading: boolean;
  error?: {
    code: string;
    description: string;
    uri?: string;
    state?: string;
  };
  reAuthenticate: (state: IGUHealthContextState) => void;
};

const stub = (): never => {
  throw new Error("IGUHealth has not been initiated.");
};

export const InitialContext: IGUHealthContextState = {
  logout: stub,
  reAuthenticate: stub,
  well_known_uri: undefined,
  isAuthenticated: false,
  payload: undefined,
  user: undefined,
  loading: false,
  error: undefined,
};

const IGUHealthContext = createContext<IGUHealthContextState>({
  ...InitialContext,
});

export default IGUHealthContext;
