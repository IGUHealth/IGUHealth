import createHTTPClient from "@iguhealth/client/http";

import type { IGUHealthContextState } from "./IGUHealthContext";

export type Action = {
  type: "INIT_CLIENT";
  domain: string;
  payload: { id_token: string; access_token: string };
};

function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

export function iguHealthReducer(state: IGUHealthContextState, action: Action) {
  switch (action.type) {
    case "INIT_CLIENT": {
      const user = parseJwt(action.payload.id_token);
      return {
        ...state,
        isAuthenticated: true,
        getClient: () => {
          return createHTTPClient({
            getAccessToken: () => Promise.resolve(action.payload.access_token),
            url: new URL(
              `/w/${user["https://iguhealth.app/tenants"][0].id}/api/v1/fhir/r4`,
              action.domain,
            ).toString(),
            headers: {},
          });
        },
        user,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
