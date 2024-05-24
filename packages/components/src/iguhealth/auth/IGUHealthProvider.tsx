import React, { useEffect, useReducer, useRef } from "react";

import { AccessToken, IDToken, TenantId } from "@iguhealth/jwt";

import IGUHealthContext, { InitialContext } from "./IGUHealthContext";
import { OIDC_WELL_KNOWN, iguHealthReducer } from "./reducer";
import { conditionalAddTenant, hasAuthQueryParams } from "./utilities";

function dec2hex(dec: number) {
  return dec.toString(16).padStart(2, "0");
}

function generateRandomString(len: number) {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}

const state_key = (client_id: string) => `iguhealth_${client_id}`;

async function handleRedirectCallback({
  token_endpoint,
  clientId,
}: {
  token_endpoint: string;
  clientId: string;
}) {
  const localStateParameter = window.localStorage.getItem(state_key(clientId));
  // Call to retrieve token using current url.
  const parameters: Record<string, string> = window.location.search
    .slice(1)
    .split("&")
    .map((v) => v.trim())
    .map((p) => p.split("=").map((v) => v.trim()))
    .reduce((acc, [key, v]) => ({ ...acc, [key]: v }), {});

  if (!parameters.state) throw new Error();
  if (!parameters.code) throw new Error();
  if (parameters.state !== localStateParameter)
    throw new Error("Invalid State");

  window.history.replaceState(null, "", location.pathname);

  const response: {
    access_token: AccessToken<string>;
    id_token: IDToken<string>;
  } = await fetch(token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      grant_type: "authorization_code",
      code: parameters.code,
      client_id: clientId,
    }),
  }).then((v) => v.json());

  return response;
}

async function handleAuthorizeInitial({
  authorize_endpoint,
  clientId,
  redirectUrl,
}: {
  authorize_endpoint: string;
  clientId: string;
  redirectUrl: string;
}) {
  const state = generateRandomString(30);
  localStorage.setItem(state_key(clientId), state);

  const url = new URL(
    `?client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}&response_type=${"code"}`,
    authorize_endpoint,
  );

  window.location.replace(url);
}

export function IGUHealthProvider({
  clientId,
  tenant,
  redirectUrl,
  domain,
  children,
  onRedirectCallback,
}: Readonly<{
  tenant?: TenantId | string;
  clientId: string;
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
      try {
        const well_known: OIDC_WELL_KNOWN = await fetch(
          new URL(`/.well-known/openid-configuration`, domain).toString(),
        ).then((v) => v.json());

        if (hasAuthQueryParams()) {
          const authorizationPayload = await handleRedirectCallback({
            token_endpoint: well_known.token_endpoint,
            clientId,
          });

          dispatch({
            type: "INIT",
            domain,
            well_known,
            tenant: tenant as TenantId,
            clientId,
            payload: authorizationPayload,
            reInitiliaze: () =>
              handleAuthorizeInitial({
                authorize_endpoint: well_known.authorization_endpoint,
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
            redirectUrl,
          });
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    })();
  }, [clientId, domain, redirectUrl]);

  return (
    <IGUHealthContext.Provider value={state}>
      {children}
    </IGUHealthContext.Provider>
  );
}
