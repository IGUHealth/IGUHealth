import React, { useEffect, useReducer, useRef } from "react";

import { AccessToken, IDToken, TenantId } from "@iguhealth/jwt";

import IGUHealthContext, { InitialContext } from "./IGUHealthContext";
import { OIDC_WELL_KNOWN, iguHealthReducer } from "./reducer";
import {
  conditionalAddTenant,
  generateRandomString,
  hasAuthQueryParams,
  sha256,
} from "./utilities";

const CODE_CHALLENGE_METHOD = "S256";
const state_key = (client_id: string) => `iguhealth_${client_id}`;
const pkce_code_verifier_key = (client_id: string) =>
  `iguhealth_pkce_code_${client_id}`;

type AccessTokenResponse = {
  access_token: AccessToken<string>;
  id_token: IDToken<string>;
  token_type: string;
  expires_in: number;
};

function getParsedParameters(): Record<string, string> {
  const parameters = window.location.search
    .slice(1)
    .split("&")
    .map((v) => v.trim())
    .map((p) => p.split("=").map((v) => v.trim()))
    .reduce((acc, [key, v]) => ({ ...acc, [key]: decodeURIComponent(v) }), {});
  return parameters;
}

async function exchangeAuthCodeForToken({
  token_endpoint,
  redirect_uri,
  parameters,
  clientId,
}: {
  redirect_uri: string;
  token_endpoint: string;
  parameters: Record<string, string>;
  clientId: string;
}): Promise<AccessTokenResponse> {
  const code_verifier = window.localStorage.getItem(
    pkce_code_verifier_key(clientId),
  );
  const localStateParameter = window.localStorage.getItem(state_key(clientId));

  if (!parameters.state) throw new Error();
  if (!parameters.code) throw new Error();
  if (parameters.state !== localStateParameter)
    throw new Error("Invalid State");

  window.localStorage.removeItem(state_key(clientId));
  window.localStorage.removeItem(pkce_code_verifier_key(clientId));

  if (!code_verifier) throw new Error("Invalid Code Verifier");

  window.history.replaceState(null, "", location.pathname);

  const response: AccessTokenResponse = await fetch(token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      grant_type: "authorization_code",
      code_verifier,
      redirect_uri,
      code: parameters.code,
      client_id: clientId,
    }),
  }).then((v) => v.json());
  return response;
}

async function handleAuthorizeInitial({
  authorize_endpoint,
  clientId,
  scope,
  redirectUrl,
}: {
  authorize_endpoint: string;
  clientId: string;
  scope: string;
  redirectUrl: string;
}) {
  const code_verifier = generateRandomString(43);
  const state = generateRandomString(30);
  const code_challenge = await sha256(code_verifier);
  localStorage.setItem(pkce_code_verifier_key(clientId), code_verifier);
  localStorage.setItem(state_key(clientId), state);

  const url = new URL(
    `?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}&state=${state}&response_type=${"code"}&code_challenge=${code_challenge}&code_challenge_method=${CODE_CHALLENGE_METHOD}`,
    authorize_endpoint,
  );

  window.location.replace(url);
}

export function IGUHealthProvider({
  clientId,
  tenant,
  redirectUrl,
  domain,
  scope,
  children,
  onRedirectCallback,
}: Readonly<{
  tenant: TenantId;
  clientId: string;
  scope: string;
  domain: string;
  redirectUrl: string;
  children: React.ReactNode;
  onRedirectCallback?: (initialPath: string) => void;
}>) {
  const [state, dispatch] = useReducer(iguHealthReducer, InitialContext);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    (async (): Promise<void> => {
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const well_known: OIDC_WELL_KNOWN = await fetch(
          new URL(
            conditionalAddTenant(
              `/oidc/.well-known/openid-configuration`,
              tenant,
            ),
            domain,
          ).toString(),
        ).then((v) => v.json());

        if (hasAuthQueryParams()) {
          const parameters = getParsedParameters();

          if (parameters.error) {
            window.history.replaceState(null, "", location.pathname);
            dispatch({
              type: "ON_ERROR",
              error: parameters.error,
              error_description: parameters.error_description,
              error_uri: parameters.error_uri,
              state: parameters.state,
            });
            console.error("Failed to authenticate");
            return;
          }

          const accessTokenPayload = await exchangeAuthCodeForToken({
            parameters,
            token_endpoint: well_known.token_endpoint,
            redirect_uri: redirectUrl,
            clientId,
          });

          dispatch({
            type: "ON_SUCCESS",
            domain,
            well_known,
            tenant,
            clientId,
            payload: accessTokenPayload,
            reInitiliaze: () =>
              handleAuthorizeInitial({
                authorize_endpoint: well_known.authorization_endpoint,
                scope,
                clientId,
                redirectUrl,
              }),
          });

          // Allows for SPA to redirect back.
          if (onRedirectCallback) {
            onRedirectCallback(sessionStorage.getItem("path") ?? "/");
          }
        } else {
          sessionStorage.setItem(
            "path",
            window.location.href.replace(window.location.origin, ""),
          );
          handleAuthorizeInitial({
            authorize_endpoint: well_known.authorization_endpoint,
            clientId,
            scope,
            redirectUrl,
          });
        }
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    })();
  }, [clientId, domain, redirectUrl]);

  return (
    <IGUHealthContext.Provider value={state}>
      {children}
    </IGUHealthContext.Provider>
  );
}
