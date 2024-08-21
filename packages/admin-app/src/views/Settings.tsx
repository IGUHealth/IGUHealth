import React from "react";
import { useRecoilValue } from "recoil";

import { deriveIGUHealthVersionedURL } from "@iguhealth/client/http";
import {
  Button,
  Input,
  Loading,
  Table,
  Toaster,
  useIGUHealth,
} from "@iguhealth/components";
import { OperationOutcome, id } from "@iguhealth/fhir-types/r4/types";
import { R4, R4B } from "@iguhealth/fhir-types/versions";
import {
  IguhealthDeleteRefreshToken,
  IguhealthDeleteScope,
  IguhealthListRefreshTokens,
  IguhealthListScopes,
} from "@iguhealth/generated-ops/lib/r4/ops";
import { IDTokenPayload } from "@iguhealth/jwt/types";

import { getClient } from "../db/client";

function copytoClipboard(token: string | undefined) {
  if (token) {
    navigator.clipboard.writeText(token);
    Toaster.success("Value copied");
  }
}

interface SettingProps {
  user?: IDTokenPayload<string>;
}

function Copyable({
  value,
  label,
}: Readonly<{ value?: string; label?: string }>) {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <div className="flex flex-1 flex-row items-center">
        <div className="flex flex-1">
          <Input readOnly value={value} />
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            copytoClipboard(value);
          }}
          className="ml-1"
        >
          Copy
        </Button>
      </div>
    </div>
  );
}

function Scopes() {
  const iguhealth = useIGUHealth();
  const client = useRecoilValue(getClient);
  const [scopes, setScopes] = React.useState<
    IguhealthListScopes.Output["scopes"]
  >([]);
  const fetchScopes = React.useMemo(() => {
    return () => {
      client.invoke_system(IguhealthListScopes.Op, {}, R4, {}).then((res) => {
        setScopes(res.scopes);
      });
    };
  }, [iguhealth]);
  React.useEffect(() => {
    fetchScopes();
  }, []);
  const deleteScopes = React.useMemo(() => {
    return (client_id: id) => {
      const deletePromise = client
        .invoke_system(IguhealthDeleteScope.Op, {}, R4, {
          client_id,
        })
        .then((res) => {
          if (res.issue[0]?.code !== "informational") {
            throw new Error("Failed to delete");
          }
          return res;
        });
      Toaster.promise(deletePromise, {
        loading: "Deleting Resource",
        success: (res) => {
          const result = res as OperationOutcome;
          fetchScopes();
          return result.issue[0].diagnostics ?? "Deleted";
        },
        error: (error) => {
          console.error(error);
          return "Failed to delete authorization.";
        },
      });
    };
  }, [iguhealth]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold ">Authorized Apps</h2>
      <div className="flex flex-col p-2 space-y-2">
        <Table
          columns={[
            {
              id: "client_id",
              content: "Client ID",
              selectorType: "fhirpath",
              selector: "$this.client_id",
            },
            {
              id: "scopes",
              content: "Scopes",
              selectorType: "fhirpath",
              selector: "$this.scopes",
            },
            {
              id: "created_at",
              content: "Authorized At",
              selectorType: "fhirpath",
              selector: "$this.created_at",
            },
            {
              id: "actions",
              content: "Actions",
              selectorType: "fhirpath",
              selector: "$this",
              renderer: (data) => {
                const scope = data[0] as NonNullable<
                  IguhealthListScopes.Output["scopes"]
                >[number];

                return (
                  <div
                    onClick={() => {
                      deleteScopes(scope.client_id);
                    }}
                    className="cursor-pointer font-semibold text-red-600 hover:text-red-700"
                  >
                    Revoke
                  </div>
                );
              },
            },
          ]}
          data={scopes ?? []}
        />
      </div>
    </div>
  );
}

function RefreshTokens() {
  const iguhealth = useIGUHealth();
  const client = useRecoilValue(getClient);
  const [refreshTokens, setRefreshTokens] = React.useState<
    IguhealthListRefreshTokens.Output["refresh-tokens"]
  >([]);
  const fetchRefreshTokens = React.useMemo(() => {
    return () => {
      client
        .invoke_system(IguhealthListRefreshTokens.Op, {}, R4, {})
        .then((res) => {
          setRefreshTokens(res["refresh-tokens"]);
        });
    };
  }, [iguhealth]);
  React.useEffect(() => {
    fetchRefreshTokens();
  }, []);
  const deleteRefreshToken = React.useMemo(() => {
    return (id: id) => {
      const deletePromise = client
        .invoke_system(IguhealthDeleteRefreshToken.Op, {}, R4, {
          id,
        })
        .then((res) => {
          if (res.issue[0]?.code !== "informational") {
            throw new Error("Failed to delete");
          }
          return res;
        });
      Toaster.promise(deletePromise, {
        loading: "Deleting Resource",
        success: (res) => {
          const result = res as OperationOutcome;
          fetchRefreshTokens();
          return result.issue[0].diagnostics ?? "Deleted";
        },
        error: (error) => {
          console.error(error);
          return "Failed to delete authorization.";
        },
      });
    };
  }, [iguhealth]);

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold ">Active Refresh Tokens</h2>
      <div className="flex flex-col p-2 space-y-2">
        <Table
          columns={[
            {
              id: "id",
              content: "ID",
              selectorType: "fhirpath",
              selector: "$this.id",
            },
            {
              id: "client_id",
              content: "Client ID",
              selectorType: "fhirpath",
              selector: "$this.client_id",
            },
            {
              id: "created_at",
              content: "Authorized At",
              selectorType: "fhirpath",
              selector: "$this.created_at",
            },
            {
              id: "actions",
              content: "Actions",
              selectorType: "fhirpath",
              selector: "$this",
              renderer: (data) => {
                const refreshToken = data[0] as NonNullable<
                  IguhealthListRefreshTokens.Output["refresh-tokens"]
                >[number];

                return (
                  <div
                    onClick={() => {
                      deleteRefreshToken(refreshToken.id);
                    }}
                    className="cursor-pointer font-semibold text-red-600 hover:text-red-700"
                  >
                    Revoke
                  </div>
                );
              },
            },
          ]}
          data={refreshTokens ?? []}
        />
      </div>
    </div>
  );
}

function SettingDisplay({ user }: Readonly<SettingProps>) {
  const iguhealth = useIGUHealth();
  return (
    <div className="flex flex-col flex-1 space-y-4 w-full">
      <h2 className="text-2xl font-semibold mb-0">Settings</h2>
      <div className="px-2">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">User Information</h2>
          <div className="flex flex-col p-2 space-y-2">
            <div>
              <label className="block font-medium">Name:</label>
              <span>{user?.name}</span>
            </div>
            <div>
              <label className="block font-medium">Email:</label>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Endpoints</h2>
          <div className="pl-2 space-y-2">
            <div className="space-y-2">
              <h3 className="text-md font-semibold ">FHIR</h3>
              <div className="pl-2 space-y-2">
                <div className="flex flex-col">
                  <Copyable
                    label="R4"
                    value={
                      iguhealth.rootURL
                        ? deriveIGUHealthVersionedURL(iguhealth.rootURL, R4)
                        : ""
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <Copyable
                    label="R4B"
                    value={
                      iguhealth.rootURL
                        ? deriveIGUHealthVersionedURL(iguhealth.rootURL, R4B)
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold ">OpenID Connect</h3>
              <div className="pl-2 space-y-2">
                <div className="flex flex-col">
                  <Copyable
                    label="Discovery"
                    value={iguhealth.well_known_uri}
                  />
                </div>
                <div className="flex flex-col">
                  <Copyable
                    label="Token"
                    value={iguhealth.well_known?.token_endpoint}
                  />
                </div>
                <div className="flex flex-col">
                  <Copyable
                    label="Authorization"
                    value={iguhealth.well_known?.authorization_endpoint}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Scopes />
      <RefreshTokens />
    </div>
  );
}

export default function Settings() {
  const iguhealth = useIGUHealth();
  return (
    <React.Suspense
      fallback={
        <div className="h-screen flex flex-1 justify-center items-center flex-col">
          <Loading />
          <div className="mt-1 ">Loading...</div>
        </div>
      }
    >
      <SettingDisplay user={iguhealth.user} />
    </React.Suspense>
  );
}
