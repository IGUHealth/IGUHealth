import createHTTPClient from "@iguhealth/client/http";
import { AccessToken, IDToken, TenantId, parseJwt } from "@iguhealth/jwt";

import type { IGUHealthContextState } from "./IGUHealthContext";
import { conditionalAddTenant } from "./utilities";

export type Action = {
  type: "INIT_CLIENT";
  domain: string;
  tenant?: TenantId;
  clientId: string;
  payload: { id_token: IDToken<string>; access_token: AccessToken<string> };
};

export function iguHealthReducer(
  state: IGUHealthContextState,
  action: Action,
): IGUHealthContextState {
  switch (action.type) {
    case "INIT_CLIENT": {
      const user = parseJwt(action.payload.id_token);
      return {
        ...state,
        isAuthenticated: true,
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
            getAccessToken: () => Promise.resolve(action.payload.access_token),
            url: new URL(
              `/w/${action.tenant ? action.tenant : user["https://iguhealth.app/tenants"][0]?.id}/api/v1/fhir/r4`,
              action.domain,
            ).toString(),
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
