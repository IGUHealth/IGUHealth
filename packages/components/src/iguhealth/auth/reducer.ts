import { CUSTOM_CLAIMS, TenantId, parseJwt } from "@iguhealth/jwt";

import type {
  AccessTokenResponse,
  IGUHealthContextState,
} from "./IGUHealthContext";
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

type SUCCESS_ACTION = {
  type: "ON_SUCCESS";
  well_known_uri: string;
  well_known: OIDC_WELL_KNOWN;
  domain: string;
  tenant?: TenantId;
  clientId: string;
  payload: AccessTokenResponse;
  reAuthenticate: (context: IGUHealthContextState) => void;
};

type REFRESH_ACTION = {
  type: "ON_REFRESH";
  payload: AccessTokenResponse;
};

type ERROR_ACTION = {
  type: "ON_ERROR";
  error: string;
  error_description: string;
  error_uri?: string;
  state?: string;
};

type LOADING_ACTION = {
  type: "SET_LOADING";
  loading: boolean;
};

type ACTION = SUCCESS_ACTION | ERROR_ACTION | LOADING_ACTION | REFRESH_ACTION;

export function iguHealthReducer(
  state: IGUHealthContextState,
  action: ACTION,
): IGUHealthContextState {
  switch (action.type) {
    case "SET_LOADING": {
      return { ...state, loading: action.loading };
    }
    case "ON_ERROR": {
      return {
        ...state,
        error: {
          code: action.error,
          description: action.error_description,
          uri: action.error_uri,
          state: action.state,
        },
      };
    }
    case "ON_REFRESH": {
      const user = parseJwt(action.payload.id_token);
      return {
        ...state,
        user,
        payload: action.payload,
      };
    }

    case "ON_SUCCESS": {
      const user = parseJwt(action.payload.id_token);
      const rootURL = new URL(
        `/w/${action.tenant ? action.tenant : user[CUSTOM_CLAIMS.TENANT]}`,
        action.domain,
      ).toString();

      return {
        ...state,
        rootURL,
        isAuthenticated: true,
        well_known_uri: action.well_known_uri,
        well_known: action.well_known,
        payload: action.payload,
        user,
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
        reAuthenticate: action.reAuthenticate,
      };
    }
    default: {
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
