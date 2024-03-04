import React, { useReducer, useEffect, useRef } from "react";
import { nanoid } from "nanoid";

import IGUHealthContext, { InitialContext } from "./IGUHealthContext";
import { iguHealthReducer } from "./reducer";
import { hasAuthQueryParams } from "./utilities";

const state_key = (client_id: string) => `iguhealth_${client_id}`;

async function handleRedirectCallback({
  domain,
  clientId,
}: {
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

  const url = new URL(`/management/auth/token`, domain);
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
  clientId,
  domain,
  redirectUrl,
}: {
  clientId: string;
  domain: string;
  redirectUrl: string;
}) {
  const state = nanoid();
  localStorage.setItem(state_key(clientId), state);

  console.log(domain);

  const url = new URL(
    `/management/auth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}&response_type=${"code"}`,
    domain,
  );
  console.log(domain, new URL(domain).pathname, url.toString());
  window.location.replace(url);
}

export default function IGUHealthProvider({
  clientId,
  redirectUrl,
  domain,
  children,
}: Readonly<{
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
            clientId,
          });
          dispatch({
            type: "SET_AUTHORIZATION_PAYLOAD",
            domain,
            payload: authorizationPayload,
          });
        } else {
          handleAuthorizeInitial({ clientId, domain, redirectUrl });
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
