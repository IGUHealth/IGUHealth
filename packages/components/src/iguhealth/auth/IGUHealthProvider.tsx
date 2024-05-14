import React, { useEffect, useReducer, useRef } from "react";

import { AccessToken, IDToken, TenantId } from "@iguhealth/jwt";

import IGUHealthContext, { InitialContext } from "./IGUHealthContext";
import { iguHealthReducer } from "./reducer";
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
  domain,
  clientId,
  tenant,
}: {
  tenant?: string;
  domain: string;
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

  const url = new URL(conditionalAddTenant(`/oidc/auth/token`, tenant), domain);
  const response: {
    access_token: AccessToken<string>;
    id_token: IDToken<string>;
  } = await fetch(url, {
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
  tenant,
  clientId,
  domain,
  redirectUrl,
}: {
  tenant?: string;
  clientId: string;
  domain: string;
  redirectUrl: string;
}) {
  const state = generateRandomString(30);
  localStorage.setItem(state_key(clientId), state);

  const url = new URL(
    conditionalAddTenant(
      `/oidc/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}&response_type=${"code"}`,
      tenant,
    ),
    domain,
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
        if (hasAuthQueryParams()) {
          const authorizationPayload = await handleRedirectCallback({
            domain,
            tenant,
            clientId,
          });
          dispatch({
            type: "INIT_CLIENT",
            domain,
            tenant: tenant as TenantId,
            clientId,
            payload: authorizationPayload,
            reInitiliaze: () =>
              handleAuthorizeInitial({ tenant, clientId, domain, redirectUrl }),
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
          handleAuthorizeInitial({ tenant, clientId, domain, redirectUrl });
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
