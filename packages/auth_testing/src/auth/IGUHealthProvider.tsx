import { nanoid } from "nanoid";
import React, { useEffect, useReducer, useRef } from "react";

import IGUHealthContext, { InitialContext } from "./IGUHealthContext";
import { iguHealthReducer } from "./reducer";
import { hasAuthQueryParams } from "./utilities";

const state_key = (client_id: string) => `iguhealth_${client_id}`;

function conditionalAddTenant(path: string, tenant?: string) {
  if (tenant) {
    return `/w/${tenant}${path}`;
  }
  return path;
}

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
  const response: { access_token: string; id_token: string } = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        grant_type: "authorization_code",
        code: parameters.code,
        client_id: clientId,
      }),
    },
  ).then((v) => v.json());

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
  const state = nanoid();
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
}: Readonly<{
  tenant?: string;
  clientId: string;
  domain: string;
  redirectUrl: string;
  children: React.ReactNode;
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
            payload: authorizationPayload,
          });
        } else {
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
