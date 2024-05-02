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
} from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";

import {
  IGUHealthProvider,
  Loading,
  ProfileDropdown,
  SideBar,
  Toaster,
  useIGUHealth,
} from "@iguhealth/components";
import "@iguhealth/components/dist/index.css";
import {
  CUSTOM_CLAIMS,
  IDTokenPayload,
  TenantClaim,
  TenantId,
} from "@iguhealth/jwt";

import { Logo } from "./components/Logo";
import Search from "./components/Search";
import SearchModal from "./components/SearchModal";
import { REACT_APP_FHIR_BASE_URL } from "./config";
import { createAdminAppClient, getClient } from "./db/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import BundleImport from "./views/BundleImport";
import EmptyWorkspace from "./views/EmptyWorkspace";
import ResourceEditor from "./views/ResourceEditor/index";
import ResourceType from "./views/ResourceType";
import Resources from "./views/Resources";
import Settings from "./views/Settings";

// Could potentially use HOST=iguhealth.localhost but instead just going to default redirect to system.iguhealth.localhost
if (
  process.env.NODE_ENV === "development" &&
  window.location.hostname === "localhost"
) {
  window.location.href = `http://system.iguhealth.localhost:${window.location.port}`;
}

function LoginWrapper() {
  const iguhealth = useIGUHealth();

  return (
    <>
      {!iguhealth.isAuthenticated ? (
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
  const iguhealth = useIGUHealth();
  const client = iguhealth.isAuthenticated ? iguhealth.getClient() : undefined;
  const [c, setClient] = useRecoilState(getClient);

  React.useEffect(() => {
    if (client) {
      setClient(createAdminAppClient(client));
    }
  }, [setClient, iguhealth.isAuthenticated]);

  return <>{c ? <>{children}</> : undefined}</>;
}

function getTenants<role>(
  jwt: IDTokenPayload<role> | undefined,
): TenantClaim<role>[] {
  if (!jwt) return [];
  return jwt[CUSTOM_CLAIMS.TENANTS] as TenantClaim<role>[];
}

function deriveTenantID(): TenantId {
  const host = window.location.host;
  const tenantID = host.split(".")[0];
  return tenantID as TenantId;
}

function WorkspaceCheck() {
  const navigate = useNavigate();
  const matches = useMatches();
  const iguhealth = useIGUHealth();

  const tenants = getTenants(iguhealth.user);

  useEffect(() => {
    if (
      tenants.length === 0 &&
      matches.find((match) => match.id === "empty-workspace") === undefined
    ) {
      navigate("/no-workspace", { replace: true });
    }
  }, [iguhealth.user, navigate, matches]);

  return (
    <>
      <Outlet />
    </>
  );
}

function IGUHealthWrapper() {
  return (
    <IGUHealthProvider
      domain={REACT_APP_FHIR_BASE_URL || ""}
      tenant={deriveTenantID()}
      clientId={"admin-app"}
      redirectUrl={window.location.origin}
    >
      <Outlet />
    </IGUHealthProvider>
  );
}

const router = createBrowserRouter([
  {
    id: "iguhealth-wrapper",
    element: <IGUHealthWrapper />,
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
  const iguhealth = useIGUHealth();
  const navigate = useNavigate();
  const matches = useMatches();
  const tenants = getTenants(iguhealth.user);

  return (
    <>
      <SideBar.SidebarLayout
        sidebar={
          <SideBar.SideBar
            top={
              <div
                onClick={() => navigate(generatePath("/", {}))}
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
                    generatePath("/resources/:resourceType", {
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
                    generatePath("/resources/:resourceType", {
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
                    generatePath("/resources/:resourceType", {
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
                    generatePath("/resources/:resourceType", {
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
                    generatePath("/resources/:resourceType", {
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
                    generatePath("/resources/:resourceType", {
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
                    generatePath("/resources/:resourceType", {
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
                    generatePath("/resources/:resourceType", {
                      resourceType: "ClientApplication",
                    }),
                  );
                }}
              >
                Client Applications
              </SideBar.SideBarItem>
            </SideBar.SideBarItemGroup>
            <SideBar.SideBarItemGroup className="mt-8" label="Messaging">
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "MessageBroker"}
                onClick={() => {
                  navigate(
                    generatePath("/resources/:resourceType", {
                      resourceType: "MessageBroker",
                    }),
                  );
                }}
              >
                Message Brokers
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                active={matches[0].params.resourceType === "MessageTopic"}
                onClick={() => {
                  navigate(
                    generatePath("/resources/:resourceType", {
                      resourceType: "MessageTopic",
                    }),
                  );
                }}
              >
                Message Topics
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
                      match.params.resourceType !== "Membership" &&
                      match.params.resourceType !== "AccessPolicy" &&
                      match.params.resourceType !== "MessageTopic" &&
                      match.params.resourceType !== "MessageBroker" &&
                      match.params.resourceType !== "ClientApplication",
                  ) !== undefined
                }
                onClick={() => {
                  navigate(generatePath("/", {}));
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
                  navigate(generatePath("/bundle-import", {}));
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
                onClick={() => navigate(generatePath("/settings", {}))}
              >
                Settings
              </SideBar.SideBarItem>
              <SideBar.SideBarItem
                logo={<ArrowLeftOnRectangleIcon />}
                onClick={() => {
                  iguhealth.logout(window.location.origin);
                }}
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
                  href="https://docs.iguhealth.app"
                >
                  Documentation
                </a>
                <ProfileDropdown
                  user={{
                    email: iguhealth.user?.email,
                    name: iguhealth.user?.given_name || iguhealth.user?.email,
                    // imageUrl: auth0.user?.picture,
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
                              const host = window.location.host.split(".");
                              window.location.href = `${window.location.protocol}//${t.id}.${host
                                .slice(1)
                                .join(".")}`;
                            }}
                          >
                            <td
                              className={classNames(
                                "hover:bg-blue-100 text-xs hover:text-blue-800 p-2 text-slate-800",
                                {
                                  "bg-blue-100 text-xs text-blue-800 p-2":
                                    deriveTenantID() === t.id,
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
                          navigate(generatePath("/settings", {}));
                        }}
                      >
                        Settings
                      </a>
                      <a
                        className="cursor-pointer block px-4 py-2 text-sm text-slate-800 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => {
                          iguhealth.logout(window.location.origin);
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
