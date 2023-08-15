import React, { useState } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

//import { FhirApp, Integer } from "@iguhealth/components";
import "@iguhealth/components/dist/output.css";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

function GetAPIToken() {
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
  return (
    <button
      onClick={() => {
        getAccessTokenWithPopup({
          authorizationParams: {
            audience: "https://api.iguhealth.com",
          },
        });
        console.log("got token");
      }}
    >
      GET API TOKEN
    </button>
  );
}

function App() {
  const [weight, setWeight] = useState(undefined as number | undefined);
  return (
    <Auth0Provider
      domain="iguhealth.us.auth0.com"
      clientId="z5x4Bt2W7Y5mVIZaTZ7kUR56Nnjrzo9B"
      authorizationParams={{
        organization: "org_yEFitTD5MCw6W9vn",
        redirect_uri: window.location.origin,
      }}
    >
      <GetAPIToken />
      <LoginButton />
      <div>Please enter patient's weight in pounds (lbs):</div>
    </Auth0Provider>
  );
}

export default App;
