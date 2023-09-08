import React from "react";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

import {
  CodeBracketSquareIcon,
  Cog6ToothIcon,
  TableCellsIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Resource } from "@iguhealth/fhir-types";
import { Layout } from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";

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
