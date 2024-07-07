import createHTTPClient from "@iguhealth/client/http";
import {
  AccessToken,
  CUSTOM_CLAIMS,
  IDToken,
  TenantId,
  parseJwt,
} from "@iguhealth/jwt";

import type { IGUHealthContextState } from "./IGUHealthContext";
import { conditionalAddTenant } from "./utilities";

export type OIDC_WELL_KNOWN = {
  issuer: string;
  userinfo_endpoint: string;
  token_endpoint: string;
  authorization_endpoint: string;
  jwks_uri: string;
  response_types_supported: string[];
  token_endpoint_auth_methods_supported?: string[];
  subject_types_supported?: string[];
};

type INIT_ACTION = {
  type: "INIT";
  well_known: OIDC_WELL_KNOWN;
  domain: string;
  tenant?: TenantId;
  clientId: string;
  payload: { id_token: IDToken<string>; access_token: AccessToken<string> };
  reInitiliaze: () => void;
};

type ACTION = INIT_ACTION;

export function iguHealthReducer(
  state: IGUHealthContextState,
  action: ACTION,
): IGUHealthContextState {
  switch (action.type) {
    case "INIT": {
      const user = parseJwt(action.payload.id_token);
      const rootURL = new URL(
        `/w/${action.tenant ? action.tenant : user[CUSTOM_CLAIMS.TENANT]}`,
        action.domain,
      ).toString();

      return {
        ...state,
        rootURL,
        isAuthenticated: true,
        well_known: action.well_known,
        id_token: action.payload.id_token,
        user,
        access_token: action.payload.access_token,
        logout: (redirect: string) => {
          const url = new URL(
            conditionalAddTenant(
              `/oidc/interaction/logout?client_id=${action.clientId}&redirect_uri=${redirect}`,
              action.tenant,
            ),
            action.domain,
          );

          window.location.replace(url);
        },
        getClient: () => {
          return createHTTPClient({
            onAuthenticationError: action.reInitiliaze,
            getAccessToken: () => Promise.resolve(action.payload.access_token),
            url: rootURL,
            headers: {},
          });
        },
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
