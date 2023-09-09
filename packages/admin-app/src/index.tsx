import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import {
  CodeBracketSquareIcon,
  Cog6ToothIcon,
  TableCellsIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Base } from "@iguhealth/components";
import { RecoilRoot, useRecoilState } from "recoil";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import createHTTPClient from "@iguhealth/client/lib/http";
import { Layout } from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";

import { getClient } from "./data/client";
import Resources from "./views/Resources";
import ResourceEditor from "./views/ResourceEditor";

import reportWebVitals from "./reportWebVitals";
import "./index.css";

function LoginWrapper({ children }: { children: React.ReactNode }) {
  const auth0Info = useAuth0();
  const initiateAuth = !auth0Info.isAuthenticated && !auth0Info.isLoading;

  useEffect(() => {
    if (initiateAuth) {
      auth0Info.loginWithRedirect({
        appState: {
          returnTo: window.location.pathname,
        },
      });
    }
  }, [initiateAuth]);

  console.log(auth0Info);

  return (
    <>
      {auth0Info.isLoading ? (
        <div> Loading...</div>
      ) : (
        <div className="h-screen flex">{children}</div>
      )}
    </>
  );
}

function ServiceSetup({ children }: { children: React.ReactNode }) {
  const auth0 = useAuth0();
  const [c, setClient] = useRecoilState(getClient);

  React.useEffect(() => {
    setClient(
      createHTTPClient({
        getAccessToken: () => auth0.getAccessTokenSilently(),
        url: process.env.REACT_APP_FHIR_BASE_URL || "",
      })
    );
  }, [setClient]);

  return <>{c ? <>{children}</> : undefined}</>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Resources /> },
      {
        path: "/resources/:resourceType/:id",
        element: <ResourceEditor />,
      },
    ],
  },
]);

function Root() {
  const auth0Info = useAuth0();
  const navigate = useNavigate();
  return (
    <Layout.SideBar.SidebarLayout
      sidebar={
        <Layout.SideBar.SideBar>
          <Layout.SideBar.SideBarItem
            active
            logo={<TableCellsIcon />}
            onClick={() => {
              navigate("/");
            }}
          >
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
        <div className="p-4 flex flex-1">
          <Base.Toaster.Toaster />
          <Outlet />
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
        audience: "https://iguhealth.com/api",
        redirect_uri: window.location.origin,
      }}
    >
      <LoginWrapper>
        <ServiceSetup>
          <RouterProvider router={router} />
        </ServiceSetup>
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
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
