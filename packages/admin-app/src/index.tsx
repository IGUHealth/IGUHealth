import { Auth0Provider, User, useAuth0 } from "@auth0/auth0-react";
import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  generatePath,
  useMatches,
  useNavigate,
  useParams,
} from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";

import createHTTPClient from "@iguhealth/client/http";
import {
  Loading,
  ProfileDropdown,
  SideBar,
  Toaster,
} from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";

import { Logo } from "./components/Logo";
import Search from "./components/Search";
import SearchModal from "./components/SearchModal";
import { createAdminAppClient, getClient } from "./db/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import BundleImport from "./views/BundleImport";
import EmptyWorkspace from "./views/EmptyWorkspace";
import ResourceEditor from "./views/ResourceEditor/index";
import ResourceType from "./views/ResourceType";
import Resources from "./views/Resources";
import Settings from "./views/Settings";

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
  const tenant = useParams().tenant as string;
  const [c, setClient] = useRecoilState(getClient);

  React.useEffect(() => {
    setClient(
      createAdminAppClient(
        createHTTPClient({
          getAccessToken: () => auth0.getAccessTokenSilently(),
          url:
            (process.env.REACT_APP_FHIR_BASE_URL || "") +
            `/w/${tenant}/api/v1/fhir/r4`,
        }),
      ),
    );
  }, [setClient]);

  return <>{c ? <>{children}</> : undefined}</>;
}

interface Tenant {
  id: string;
}

function getTenants(user: User | undefined): Tenant[] {
  return user?.["https://iguhealth.app/tenants"] as Tenant[];
}

function WorkspaceCheck() {
  const navigate = useNavigate();
  const params = useParams();
  const matches = useMatches();
  const auth0 = useAuth0();

  const tenants = getTenants(auth0.user);

  useEffect(() => {
    if (
      tenants.length === 0 &&
      matches.find((match) => match.id === "empty-workspace") === undefined
    ) {
      navigate("/no-workspace", { replace: true });
    }
    if (!params.tenant) {
      navigate(`/w/${tenants[0].id}`, { replace: true });
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
                path: "/w/:tenant/",
                element: (
                  <ServiceSetup>
                    <Root />
                  </ServiceSetup>
                ),
                children: [
                  { id: "settings", path: "settings", element: <Settings /> },
                  { id: "root", path: "", element: <Resources /> },
                  {
                    id: "types",
                    path: "resources/:resourceType",
                    element: <ResourceType />,
                  },
                  {
                    id: "instance",
                    path: "resources/:resourceType/:id",
                    element: <ResourceEditor />,
                  },
                  {
                    id: "bundle-import",
                    path: "bundle-import",
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
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const params = useParams();
  const matches = useMatches();
  const tenants = getTenants(auth0.user);

  return (
    <>
      <SideBar.SidebarLayout
        sidebar={
          <SideBar.SideBar
            top={
              <div
                onClick={() =>
                  navigate(
                    generatePath("/w/:tenant/", {
                      tenant: params.tenant as string,
                    }),
                  )
                }
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
                  navigate(
                    generatePath("/w/:tenant/resources/:resourceType", {
                      tenant: params.tenant as string,
                      resourceType: "OperationDefinition",
                    }),
                  );
                }}
              >
                Custom Operations
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "Subscription"}
                onClick={() => {
                  navigate(
                    generatePath("/w/:tenant/resources/:resourceType", {
                      tenant: params.tenant as string,
                      resourceType: "Subscription",
                    }),
                  );
                }}
              >
                Subscriptions
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
            <SideBar.SideBarItemGroup className="mt-8" label="UI">
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "Questionnaire"}
                onClick={() => {
                  navigate(
                    generatePath("/w/:tenant/resources/:resourceType", {
                      tenant: params.tenant as string,
                      resourceType: "Questionnaire",
                    }),
                  );
                }}
              >
                Questionnaires
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                active={
                  matches[0].params.resourceType === "QuestionnaireResponse"
                }
                onClick={() => {
                  navigate(
                    generatePath("/w/:tenant/resources/:resourceType", {
                      tenant: params.tenant as string,
                      resourceType: "QuestionnaireResponse",
                    }),
                  );
                }}
              >
                Questionnaire Responses
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
            <SideBar.SideBarItemGroup className="mt-8" label="Monitoring">
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "AuditEvent"}
                onClick={() => {
                  navigate(
                    generatePath("/w/:tenant/resources/:resourceType", {
                      tenant: params.tenant as string,
                      resourceType: "AuditEvent",
                    }),
                  );
                }}
              >
                Audit Events
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>

            <SideBar.SideBarItemGroup className="mt-8" label="Security">
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "Membership"}
                onClick={() => {
                  navigate(
                    generatePath("/w/:tenant/resources/:resourceType", {
                      tenant: params.tenant as string,
                      resourceType: "Membership",
                    }),
                  );
                }}
              >
                Membership
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "AccessPolicy"}
                onClick={() => {
                  navigate(
                    generatePath("/w/:tenant/resources/:resourceType", {
                      tenant: params.tenant as string,
                      resourceType: "AccessPolicy",
                    }),
                  );
                }}
              >
                Access Policies
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "ClientApplication"}
                onClick={() => {
                  navigate(
                    generatePath("/w/:tenant/resources/:resourceType", {
                      tenant: params.tenant as string,
                      resourceType: "ClientApplication",
                    }),
                  );
                }}
              >
                Client Applications
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
                      match.params.resourceType !== "AccessPolicy" &&
                      match.params.resourceType !== "ClientApplication",
                  ) !== undefined
                }
                onClick={() => {
                  navigate(
                    generatePath("/w/:tenant", {
                      tenant: params.tenant as string,
                    }),
                  );
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
                  navigate(
                    generatePath("/w/:tenant/bundle-import", {
                      tenant: params.tenant as string,
                    }),
                  );
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
                onClick={() =>
                  navigate(
                    generatePath("/w/:tenant/settings", {
                      tenant: params.tenant as string,
                    }),
                  )
                }
              >
                Settings
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                logo={<ArrowLeftOnRectangleIcon />}
                onClick={() =>
                  auth0.logout({
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
                    email: auth0.user?.email,
                    name: auth0.user?.name,
                    imageUrl: auth0.user?.picture,
                  }}
                >
                  <div>
                    <div>
                      <div className="mt-1">
                        <div className="p-2 text-sm text-slate-600 font-semibold">
                          Tenants
                        </div>
                      </div>

                      <table className="border-collapse bg-gray-50 w-full">
                        {tenants.map((t) => (
                          <tr
                            key={t.id}
                            className="border border-r-0 border-l-0 cursor-pointer"
                            onClick={() => {
                              window.location.href = generatePath(
                                "/w/:tenant",
                                {
                                  tenant: t.id,
                                },
                              );
                            }}
                          >
                            <td
                              className={classNames(
                                "hover:bg-blue-100 text-xs hover:text-blue-800 p-2 text-slate-800",
                                {
                                  "bg-blue-100 text-xs text-blue-800 p-2":
                                    params.tenant === t.id,
                                },
                              )}
                            >
                              {t.id}
                            </td>
                          </tr>
                        ))}
                      </table>
                    </div>
                    <div className="mt-2">
                      <a
                        className={classNames(
                          "cursor-pointer block px-4 py-2 text-sm  hover:text-blue-800 hover:bg-blue-100",
                          {
                            "text-slate-800":
                              matches.find(
                                (match) => match.id === "settings",
                              ) === undefined,
                            "bg-blue-100 text-blue-800":
                              matches.find(
                                (match) => match.id === "settings",
                              ) !== undefined,
                          },
                        )}
                        onClick={() => {
                          navigate(
                            generatePath("/w/:tenant/settings", {
                              tenant: params.tenant as string,
                            }),
                          );
                        }}
                      >
                        Settings
                      </a>
                      <a
                        className="cursor-pointer block px-4 py-2 text-sm text-slate-800 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => {
                          auth0.logout({
                            logoutParams: {
                              returnTo: window.location.origin,
                            },
                          });
                        }}
                      >
                        Sign out
                      </a>
                    </div>
                  </div>
                </ProfileDropdown>
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
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
