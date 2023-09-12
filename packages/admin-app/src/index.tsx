import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import {
  CodeBracketSquareIcon,
  TableCellsIcon,
  ArrowLeftOnRectangleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { RecoilRoot, useRecoilState } from "recoil";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  useMatches,
} from "react-router-dom";

import createHTTPClient from "@iguhealth/client/lib/http";
import { Layout, Base } from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";

import { getClient } from "./data/client";
import Resources from "./views/Resources";
import ResourceType from "./views/ResourceType";
import ResourceEditor from "./views/ResourceEditor";
import reportWebVitals from "./reportWebVitals";
import { Logo } from "./components/logo";

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

  return (
    <>
      {auth0Info.isLoading ? (
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Base.Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
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
      { id: "root", path: "/", element: <Resources /> },
      {
        id: "types",
        path: "/resources/:resourceType",
        element: <ResourceType />,
      },
      {
        id: "instance",
        path: "/resources/:resourceType/:id",
        element: <ResourceEditor />,
      },
    ],
  },
]);

function Root() {
  const auth0Info = useAuth0();
  const navigate = useNavigate();
  const matches = useMatches();

  return (
    <Layout.SideBar.SidebarLayout
      sidebar={
        <Layout.SideBar.SideBar
          top={
            <div className="w-16 h-16 p-2 mb-4">
              <Logo />
            </div>
          }
        >
          <Layout.SideBar.SideBarItemGroup label="Data">
            <Layout.SideBar.SideBarItem
              active={
                matches.find((match) => match.id === "root") !== undefined ||
                matches.find(
                  (match) =>
                    match.id === "types" &&
                    match.params.resourceType !== "OperationDefinition" &&
                    match.params.resourceType !== "Subscription"
                ) !== undefined
              }
              logo={<TableCellsIcon />}
              onClick={() => {
                navigate("/");
              }}
            >
              Resources
            </Layout.SideBar.SideBarItem>
          </Layout.SideBar.SideBarItemGroup>
          <Layout.SideBar.SideBarItemGroup
            className="mt-4"
            label="Configuration"
          >
            <Layout.SideBar.SideBarItem
              active={matches[0].params.resourceType === "OperationDefinition"}
              logo={<CodeBracketSquareIcon />}
              onClick={() => {
                navigate("/resources/OperationDefinition");
              }}
            >
              Custom Operations
            </Layout.SideBar.SideBarItem>
            <Layout.SideBar.SideBarItem
              active={matches[0].params.resourceType === "Subscription"}
              logo={<ShareIcon />}
              onClick={() => {
                navigate("/resources/Subscription");
              }}
            >
              Subscriptions
            </Layout.SideBar.SideBarItem>
          </Layout.SideBar.SideBarItemGroup>
          <Layout.SideBar.SideBarItemGroup className="mt-auto" label="User">
            {/* <Layout.SideBar.SideBarItem logo={<Cog6ToothIcon />}>
              Settings
            </Layout.SideBar.SideBarItem> */}
            <Layout.SideBar.SideBarItem
              logo={<ArrowLeftOnRectangleIcon />}
              onClick={() => auth0Info.logout()}
            >
              Sign out
            </Layout.SideBar.SideBarItem>
          </Layout.SideBar.SideBarItemGroup>
        </Layout.SideBar.SideBar>
      }
    >
      <>
        <div className="px-4 sm:px-6 lg:px-8 border-b">
          <div className="flex h-16 items-center justify-between">
            <div className="font-semibold text-lg">
              <Base.BreadCrumbs
                breadcrumbs={[
                  <span
                    onClick={() => {
                      navigate("/");
                    }}
                    className="hover:text-indigo-600 cursor-pointer"
                  >
                    Resources
                  </span>,
                  ...(matches[0].params.resourceType
                    ? [
                        <span
                          onClick={() => {
                            navigate(
                              `/resources/${matches[0].params.resourceType}`
                            );
                          }}
                          className="hover:text-indigo-600 cursor-pointer"
                        >
                          {matches[0].params.resourceType}
                        </span>,
                      ]
                    : []),
                  ...(matches[0].params.id
                    ? [
                        <span
                          onClick={() => {
                            navigate(
                              `/resources/${matches[0].params.resourceType}/${matches[0].params.id}`
                            );
                          }}
                          className="hover:text-indigo-600 cursor-pointer"
                        >
                          {matches[0].params.id}
                        </span>,
                      ]
                    : []),
                ]}
              />
            </div>
            <Layout.ProfileDropdown
              user={{
                email: auth0Info.user?.email,
                name: auth0Info.user?.name,
                imageUrl: auth0Info.user?.picture,
              }}
              navigation={[{ name: "Sign out" }]}
              onNavigation={() => auth0Info.logout()}
            />
          </div>
        </div>
        <div className="p-4 flex flex-1 mt-2">
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
