import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { RecoilRoot, useRecoilState } from "recoil";
import {
  Outlet,
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  useMatches,
} from "react-router-dom";

import createHTTPClient from "@iguhealth/client/http";
import {
  SideBar,
  Loading,
  Toaster,
  ProfileDropdown,
} from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";

import { getClient, createCachedClient } from "./db/client";
import Settings from "./views/Settings";
import BundleImport from "./views/BundleImport";
import EmptyWorkspace from "./views/EmptyWorkspace";
import Resources from "./views/Resources";
import ResourceType from "./views/ResourceType";
import ResourceEditor from "./views/ResourceEditor/index";
import reportWebVitals from "./reportWebVitals";
import { Logo } from "./components/Logo";
import Search from "./components/Search";
import SearchModal from "./components/SearchModal";

import "./index.css";

function LoginWrapper() {
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
      {auth0Info.isLoading || !auth0Info.isAuthenticated ? (
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
      ) : (
        <div className="h-screen flex">
          <Outlet />
        </div>
      )}
    </>
  );
}

function ServiceSetup({ children }: { children: React.ReactNode }) {
  const auth0 = useAuth0();
  const [c, setClient] = useRecoilState(getClient);

  React.useEffect(() => {
    setClient(
      createCachedClient(
        createHTTPClient({
          getAccessToken: () => auth0.getAccessTokenSilently(),
          url: process.env.REACT_APP_FHIR_BASE_URL || "",
        })
      )
    );
  }, [setClient]);

  return <>{c ? <>{children}</> : undefined}</>;
}

function WorkspaceCheck() {
  const navigate = useNavigate();
  const matches = useMatches();
  const auth0 = useAuth0();

  useEffect(() => {
    if (
      auth0.user?.["https://iguhealth.app/workspaces"].length === 0 &&
      matches.find((match) => match.id === "empty-workspace") === undefined
    ) {
      navigate("/no-workspace", { replace: true });
    }
  }, [auth0.user, navigate, matches]);

  return (
    <>
      <Outlet />
    </>
  );
}

function Auth0Wrapper() {
  const navigate = useNavigate();
  return (
    <Auth0Provider
      useRefreshTokens
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ""}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ""}
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo || "/");
      }}
      authorizationParams={{
        audience: "https://iguhealth.com/api",
        redirect_uri: window.location.origin,
      }}
    >
      <Outlet />
    </Auth0Provider>
  );
}

const router = createBrowserRouter([
  {
    id: "auth0-wrapper",
    element: <Auth0Wrapper />,
    children: [
      {
        id: "login",
        element: <LoginWrapper />,
        children: [
          {
            path: "/",
            element: <WorkspaceCheck />,
            children: [
              {
                id: "empty-workspace",
                path: "/no-workspace",
                element: <EmptyWorkspace />,
              },
              {
                path: "/",
                element: (
                  <ServiceSetup>
                    <Root />
                  </ServiceSetup>
                ),
                children: [
                  { id: "settings", path: "/settings", element: <Settings /> },
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
                  {
                    id: "bundle-import",
                    path: "/bundle-import",
                    element: <BundleImport />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

function Root() {
  const auth0Info = useAuth0();
  const navigate = useNavigate();
  const matches = useMatches();

  return (
    <>
      <SideBar.SidebarLayout
        sidebar={
          <SideBar.SideBar
            top={
              <div
                onClick={() => navigate("/")}
                className="cursor-pointer w-16 h-16 p-2 mt-4"
              >
                <Logo />
              </div>
            }
          >
            <SideBar.SideBarItemGroup className="mt-8" label="Configuration">
              <SideBar.SideBarItem
                active={
                  matches[0].params.resourceType === "OperationDefinition"
                }
                onClick={() => {
                  navigate("/resources/OperationDefinition");
                }}
              >
                Custom Operations
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "Subscriptions"}
                onClick={() => {
                  navigate("/resources/Subscription");
                }}
              >
                Subscriptions
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
            <SideBar.SideBarItemGroup className="mt-8" label="UI">
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "Questionnaires"}
                onClick={() => {
                  navigate("/resources/Questionnaire");
                }}
              >
                Questionnaires
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                active={
                  matches[0].params.resourceType === "QuestionnaireResponses"
                }
                onClick={() => {
                  navigate("/resources/QuestionnaireResponse");
                }}
              >
                Questionnaire Responses
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
            <SideBar.SideBarItemGroup className="mt-8" label="Monitoring">
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "AuditEvents"}
                onClick={() => {
                  navigate("/resources/AuditEvent");
                }}
              >
                Audit Events
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>

            <SideBar.SideBarItemGroup className="mt-8" label="Security">
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "User"}
                onClick={() => {
                  navigate("/resources/User");
                }}
              >
                Users
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "AccessPolicy"}
                onClick={() => {
                  navigate("/resources/AccessPolicy");
                }}
              >
                Access Policies
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
            <SideBar.SideBarItemGroup label="Data" className="mt-8">
              <SideBar.SideBarItem
                active={
                  matches.find((match) => match.id === "root") !== undefined ||
                  matches.find(
                    (match) =>
                      match.id === "types" &&
                      match.params.resourceType !== "OperationDefinition" &&
                      match.params.resourceType !== "Subscription" &&
                      match.params.resourceType !== "Questionnaire" &&
                      match.params.resourceType !== "QuestionnaireResponse" &&
                      match.params.resourceType !== "AuditEvent" &&
                      match.params.resourceType !== "User" &&
                      match.params.resourceType !== "AccessPolicy"
                  ) !== undefined
                }
                onClick={() => {
                  navigate("/");
                }}
              >
                All Resources
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
            <SideBar.SideBarItemGroup className="mt-8" label="Import">
              <SideBar.SideBarItem
                active={
                  matches.find((match) => match.id === "bundle-import") !==
                  undefined
                }
                onClick={() => {
                  navigate("/bundle-import");
                }}
              >
                Bundles
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
            {/* Used because want to maintain a margin of at least 8 when shrinking. */}
            <div className="mb-8" />
            <SideBar.SideBarItemGroup className="mt-auto" label="User">
              <SideBar.SideBarItem
                logo={<Cog6ToothIcon />}
                active={
                  matches.find((match) => match.id === "settings") !== undefined
                }
                onClick={() => navigate("/settings")}
              >
                Settings
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                logo={<ArrowLeftOnRectangleIcon />}
                onClick={() =>
                  auth0Info.logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  })
                }
              >
                Sign out
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
          </SideBar.SideBar>
        }
      >
        <>
          <div className="px-4 z-10 sm:px-6 lg:px-8 sticky top-0 bg-white">
            <div
              className="flex items-center justify-between"
              style={{ height: "64px" }}
            >
              <Search />
              <div className="flex justify-center items-center space-x-8">
                <a
                  target="_blank"
                  className="cursor text-slate-500 hover:text-slate-600 hover:underline"
                  href="https://docs.iguhealth.app/docs/intro"
                >
                  Documentation
                </a>
                <ProfileDropdown
                  user={{
                    email: auth0Info.user?.email,
                    name: auth0Info.user?.name,
                    imageUrl: auth0Info.user?.picture,
                  }}
                  navigation={[
                    { id: "settings", name: "Settings" },
                    { id: "sign-out", name: "Sign out" },
                  ]}
                  onNavigation={(item) => {
                    switch (item.id) {
                      case "settings": {
                        navigate("/settings");
                        return;
                      }
                      case "sign-out": {
                        auth0Info.logout({
                          logoutParams: {
                            returnTo: window.location.origin,
                          },
                        });
                        return;
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className="p-4 flex flex-1 "
            style={{ maxHeight: "calc(100vh - 64px)" }}
          >
            <Toaster.Toaster />
            <Outlet />
          </div>
        </>
      </SideBar.SidebarLayout>
      <React.Suspense fallback={<div />}>
        <SearchModal />
      </React.Suspense>
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
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
