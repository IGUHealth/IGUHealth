import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import {
  CodeBracketSquareIcon,
  Cog6ToothIcon,
  TableCellsIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useSetRecoilState } from "recoil";

import createHTTPClient from "@iguhealth/client/lib/http";
import { client } from "./data/client";
import { Resource } from "@iguhealth/fhir-types";
import { Layout } from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";

import reportWebVitals from "./reportWebVitals";
import "./index.css";

Layout.SideBar.SidebarLayout;

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

function SetupServices({ children }: { children: React.ReactNode }) {
  const setClient = useSetRecoilState(client);
  const auth0 = useAuth0();
  React.useEffect(() => {
    if (auth0.isAuthenticated) {
      setClient(
        createHTTPClient({
          getAccessToken: () => auth0.getAccessTokenSilently(),
          url: process.env.REACT_APP_FHIR_BASE_URL || "",
        })
      );
    }
  }, []);
}

function Root() {
  const auth0Info = useAuth0();
  return (
    <Layout.SideBar.SidebarLayout
      sidebar={
        <Layout.SideBar.SideBar>
          <Layout.SideBar.SideBarItem active logo={<TableCellsIcon />}>
            Resources
          </Layout.SideBar.SideBarItem>
          <Layout.SideBar.SideBarItem logo={<CodeBracketSquareIcon />}>
            Custom Operations
          </Layout.SideBar.SideBarItem>
          <Layout.SideBar.SideBarItemGroup className="mt-auto" label="User">
            <Layout.SideBar.SideBarItem logo={<Cog6ToothIcon />}>
              Settings
            </Layout.SideBar.SideBarItem>
            <Layout.SideBar.SideBarItem logo={<ArrowLeftOnRectangleIcon />}>
              Sign out
            </Layout.SideBar.SideBarItem>
          </Layout.SideBar.SideBarItemGroup>
        </Layout.SideBar.SideBar>
      }
    >
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
        <div className="p-4">
          <span>Testing</span>
        </div>
      </>
    </Layout.SideBar.SidebarLayout>
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

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
