import React from "react";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

import { Resource } from "@iguhealth/fhir-types";
import { Layout } from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";

function LoginWrapper({ children }: { children: React.ReactNode }) {
  const auth0Info = useAuth0();
  const initiateAuth = !auth0Info.isAuthenticated && !auth0Info.isLoading;
  if (initiateAuth) {
    auth0Info.loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    });
  }

  return <>{children}</>;
}

function Root() {
  const auth0Info = useAuth0();
  return (
    <>
      <Layout.Navigation
        active="Dashboard"
        user={{
          email: auth0Info.user?.email,
          name: auth0Info.user?.name,
          imageUrl: auth0Info.user?.picture,
        }}
        navigation={[{ name: "Dashboard" }, { name: "Resources" }]}
        userNavigation={[{ name: "Settings" }, { name: "Sign out" }]}
      />
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </>
  );
}

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ""}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <LoginWrapper>
        <Root />
      </LoginWrapper>
    </Auth0Provider>
  );
}

export default App;
